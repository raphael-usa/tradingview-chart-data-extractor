import { xbrowser } from '../utils/browser';

function isLocalhostWithValidPort() {
    const { hostname, port } = window.location;

    // Check if the hostname is localhost and the port is within your criteria
    return hostname === 'localhost' && (port >= 3000 && port <= 4000);
}

// var count = 1;

// Main logic
if (isLocalhostWithValidPort()) {
    // Your content script logic for localhost with a valid port
    console.log('Executing content script on localhost with a valid port');


    xbrowser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        let type = message.type;
        message = message.message;
        // Check if the message is intended for this content script
        if (message && type === "BACKGROUND_TO_LOCALHOST_CS") {
            // Do something with the message, for example, log it
            // console.log("count: ", count, "\tlocalhost cs, onMessage: message:", {message});


            window.postMessage({ type: "LOCALHOST_CS_TO_LOCALHOST_DOM", message }, '*');
            // You can also send a response back if needed
            // sendResponse({ received: true });
        }
    });
}