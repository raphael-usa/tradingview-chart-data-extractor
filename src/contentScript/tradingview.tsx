import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
// import { delay, formatCurrentTime } from '../utils/common.js';
import FloatingMovableContainer from '../components/FloatingMovableContainer';

import { createRoot } from 'react-dom/client';

import { xbrowser } from '../utils/browser';

function formatCurrentTime() {
    const now = new Date();

    // Extracting components of the time
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Formatting the time into "hour:min:sec" format
    const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;

    return formattedTime;
}

// Helper function to pad single-digit numbers with a leading zero
function padZero(number: number) {
    return number < 10 ? `0${number}` : number;
}

function handleMessageFromDOM(data?: any) {
    try {
        let message = data.message;
        let resultArray = message.split(/~m~/);
        let filteredArray = resultArray.filter((value: string | string[] | undefined) => value !== undefined && value !== '' && (value.includes('{') || value.includes(':')));

        // console.log({ filteredArray, resultArray });

        var timeNow = formatCurrentTime();

        filteredArray.forEach(myFunction);

        function myFunction(value: string, index: any) {
            try {
                let item = JSON.parse(value);
                let m = item.m;

                if (m) {
                    switch (m) {
                        case "timescale_update":
                            console.log(timeNow, ">>> timescale_update", { item })
                            break;
                        case "series_completed":
                            console.log(timeNow, ">>> series_completed", { item })
                            break;
                        case "quote_completed":
                            let ticker = item.p[1];
                            console.log(timeNow, ">>> quote_completed > ", { ticker, item });
                            break;

                        case "du":
                            let p1 = item.p[1];
                            let sds_1 = p1['sds_1'];
                            if (sds_1) {
                                let test = sds_1['s'][0]['v'];
                                console.log(timeNow, ">>> DUUUU > ", { p1, item, test });
                            }
                            else{
                                console.log(timeNow, ">>> DU OTHER > ", { p1, item });
                            }

                            break;
                        default:
                            console.log(timeNow, "xxx not handled: ", { m, item });
                    }
                }
                else {
                    console.log(timeNow, '%c XXXX no m prop: ', 'background: blue; color: #bada55', { item });
                }

            } catch (error) {
                console.error(timeNow, "in filteredArray.forEach(myFunction) error: ", { error, value });
                alert(error);
            }

        }
    } catch (error) {
        console.error("handleMessageFromDOM error: ", { error, data });
        alert(error);
    }


    // console.log('Message received from DOM:', message);

    // Perform actions based on the message
}

// Listen for messages from the webpage DOM
window.addEventListener('message', (event) => {
    // Ensure the message is from a trusted source (e.g., check event.origin)
    if (event.source === window && event.data) {
        handleMessageFromDOM(event.data);
    }
});


const appContainer = document.createElement('div');
document.body.appendChild(appContainer);
const root = createRoot(appContainer); // createRoot(container!) if you use TypeScript


const TradingViewContentScript = () => {
    const [messageTestResponse, setMessageTestResponse] = useState('');
    const [fullAppState, setFullAppState] = useState({});

    // const sendMessage = () => {
    //     let timeNow = formatCurrentTime();
    //     console.log("sendMessage ", { timeNow });
    //     if (typeof browser !== 'undefined') {
    //         // Firefox
    //         console.log('Extension is running in Firefox');
    //         browser.runtime.sendMessage({ type: "MESSAGE_TEST", data: { timeNow, more: "data" } }, (response) => {
    //             if (response) {
    //                 console.log({ response });
    //                 setMessageTestResponse(JSON.stringify(response));
    //             } else {
    //                 console.error("sendMessage MESSAGE_TEST error, no response");
    //             }
    //         });
    //     } else if (typeof chrome !== 'undefined') {
    //         // Chrome
    //         console.log('Extension is running in Chrome');
    //         chrome.runtime.sendMessage({ type: "MESSAGE_TEST", data: { timeNow, more: "data" } }, (response) => {
    //             if (response) {
    //                 console.log({ response });
    //                 setMessageTestResponse(JSON.stringify(response));
    //             } else {
    //                 console.error("sendMessage MESSAGE_TEST error, no response");
    //             }
    //         });
    //     } else {
    //         console.error('Unable to determine the browser');
    //     }
    // }

    // const getAppStateFull = () => {
    //     if (typeof browser !== 'undefined') {
    //         // Firefox
    //         console.log('Extension is running in Firefox');
    //         browser.runtime.sendMessage({ type: "APP_STATE_FULL" }, (response) => {
    //             if (response) {
    //                 console.log({ response });
    //                 setFullAppState(response);
    //             } else {
    //                 console.error("sendMessage APP_STATE_FULL error, no response");
    //             }
    //         });
    //     } else if (typeof chrome !== 'undefined') {
    //         // Chrome
    //         console.log('Extension is running in Chrome');
    //         chrome.runtime.sendMessage({ type: "APP_STATE_FULL" }, (response) => {
    //             if (response) {
    //                 console.log({ response });
    //                 setFullAppState(response);

    //             } else {
    //                 console.error("sendMessage APP_STATE_FULL error, no response");
    //             }
    //         });
    //     } else {
    //         console.error('Unable to determine the browser');
    //     }
    // };

    const injectJS = () => {
        console.log("injectJS");
        console.log({ window });
        xbrowser.runtime.sendMessage({ type: "INJECT_JS_TRADINGVIEW" }, (response?: any) => {
            if (response) {
                console.log({ response });
                // setFullAppState(response);

            } else {
                console.error("sendMessage APP_STATE_FULL error, no response");
            }
        });
    };

    useEffect(() => {
        console.log("TradingViewContentScript useEffect");

    }, []);

    console.log("TradingViewContentScript loaded");

    return (
        <React.Fragment>
            <FloatingMovableContainer bottom={2} right={2} >
                <div style={{ maxWidth: '400px' }}>
                    <h1>Hello TradingViewContentScript</h1>
                    <hr />
                    <button onClick={injectJS}>background.js inject js to page</button>
                    {/* <span>messageTestResponse: {messageTestResponse}</span>
                    <hr />
                    <button onClick={getAppStateFull}>getFullAppState</button>
                    <span>getFullAppState: {JSON.stringify(fullAppState)}</span> */}
                </div>

            </FloatingMovableContainer>
        </React.Fragment>

    );
};

root.render(<TradingViewContentScript />);

console.info('contentScript is running on tradingview.com');




// (() => {
//     if (window.hasRunContentScriptOnce === true) return;
//     window.hasRunContentScriptOnce = true;

//     // Wait for page load and inject script
//     xbrowser.runtime.onMessage.addListener((message, sender, sendResponse) => {
//         if (message.action === "TRADINGVIEW_INJECT_SCRIPT") {
//             console.log(">>> TRADINGVIEW_INJECT_SCRIPT")
//             const script = document.createElement("script");
//             script.textContent = `
//         // Your JavaScript code to be injected here
//         console.log("Injected script is running!");
//         const WS = window.WSBackendConnection;
//         console.log("window.WSBackendConnection:", WS);
//         // xbrowser.runtime.sendMessage({ action: "sendWS", WS });
//       `;
//             (document.head || document.documentElement).appendChild(script);
//             script.remove(); // Remove script after execution (optional)
//         }
//     });

//     // Check for page load and send message to background script
//     function waitForPageLoad() {
//         if (document.readyState === "complete") {
//             xbrowser.runtime.sendMessage({ action: "TRADINGVIEW_INJECT_SCRIPT" });
//         } else {
//             setTimeout(waitForPageLoad, 100);
//         }
//     }
//     waitForPageLoad();

// })();


