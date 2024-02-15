import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
// import { delay, formatCurrentTime } from '../utils/common.js';
import FloatingMovableContainer from '../components/FloatingMovableContainer';

import { createRoot } from 'react-dom/client';

import { xbrowser } from '../utils/browser';


// Listen for messages from the webpage DOM
window.addEventListener('message', (event) => {
    // Ensure the message is from a trusted source (e.g., check event.origin)
    if (event.source === window && event.data && event.data.type === "DOM_TO_TRADINGVIEW_CONTENT_SCRIPT") {
        let message = event.data.message;
        // handleMessageFromDOM(event.data);
        // console.log({DOM_TO_TRADINGVIEW_CONTENT_SCRIPT: event.data});

        xbrowser.runtime.sendMessage({ type: "TRADINGVIEW_CS_TO_BACKGROUND", message }, (response?: any) => {
            if (response) {
                console.log({ response });
            }
        });
        
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

    const disconnectWS = () => {
        console.log("send disconnectWS message to window");
        window.postMessage({ type: "DISCONNECT_WS_FROM_TV_CS" }, '*');
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

                    <button onClick={disconnectWS}><h3>Disconnect WebSocket</h3></button>
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


