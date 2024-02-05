import { xbrowser } from '../utils/browser'

import * as cheerio from 'cheerio';

import { newWebSocketScript } from './newWebSocketScript.js';

import { formatCurrentTimeHMS } from '../utils/common.js';

// import { createSlice, configureStore } from '@reduxjs/toolkit';

console.log('background is running');
const htmlString = '<h2 class="title">Hello world</h2>';
var $ = cheerio.load(htmlString);

console.log({ htmlString }, "S: ", $);


console.log(xbrowser.runtime.getURL("") + "home.html");







// const socket = new WebSocket('ws://localhost:4000');

// function sendMessageToServer(message: { yourMessage: string; }) {
//   try {
//     socket.send(JSON.stringify(message));  
//   } catch (error) {
//     console.log("sendMessageToServer error: ", {error});
//   }

// }

// // Send a message to the WebSocket server every 5 seconds
// setInterval(function () {
//   sendMessageToServer({ yourMessage: 'Hello from background.js' });
// }, 5000);


// Function to send a message to a specific tab
function sendMessageToTab(tabId: any, message: any) {
  xbrowser.tabs.sendMessage(tabId, message);
}

// Function to send a message to tabs with URLs containing "localhost"
// function sendMessageToTabsWithLocalhost(message: { yourMessage: string; }) {
//   xbrowser.tabs.query({}, function (tabs: any[]) {
//     tabs.forEach(function (tab) {
//       // Check if the tab's URL contains "localhost"
//       if (tab.url && tab.url.includes("localhost")) {
//         console.log("sendingMessage tab match: ", { tab: tab.url });
//         sendMessageToTab(tab.id, message);
//       }
//     });
//   });
// }

// Example: Sending a message to tabs with "localhost" in the URL every 5 seconds
const messageToTabsWithLocalhost = { yourMessage: 'Hello from background.js to tabs with localhost!' };

// Set up an interval to send the message every 5 seconds
// setInterval(function () {
//   sendMessageToTabsWithLocalhost(messageToTabsWithLocalhost);
// }, 5000);



// const counterSlice = createSlice({
//   name: 'counter',
//   initialState: {
//     value: 0
//   },
//   reducers: {
//     incremented: state => {
//       state.value += 1
//     },
//     decremented: state => {
//       state.value -= 1
//     }
//   }
// })

// export const { incremented, decremented } = counterSlice.actions;


// const store = configureStore({
//   reducer: counterSlice.reducer,
// })

// // Can still subscribe to the store
// // store.subscribe(() => console.log(store.getState()));

// // Still pass action objects to `dispatch`, but they're created for us
// store.dispatch(incremented());
// window.TEST_STORE = store;
// console.log(store.getState());


xbrowser.runtime.onMessage.addListener(async (request: { type: string; message?: any; }) => {
  if (request.type === 'TEST_MESSAGE') {
    console.log('background has received a message TEST_MESSAGE ', request?.message);
  }
  if (request.type === 'INJECT_JS_TRADINGVIEW') {
    console.log('background has received a message INJECT_JS_TRADINGVIEW ', { message: request?.message });
  }

  if (request.type === 'TRADINGVIEW_CS_TO_BACKGROUND') {
    // console.log({TRADINGVIEW_CS_TO_BACKGROUND: {request}});
    let message = request.message;
    xbrowser.tabs.query({}, function (tabs: any[]) {
      tabs.forEach(function (tab) {
        // Check if the tab's URL contains "localhost"
        if (tab.url && tab.url.includes("localhost")) {
          console.log("sendingMessage tab match: ", { tab: tab.url });
          sendMessageToTab(tab.id, {type: 'BACKGROUND_TO_LOCALHOST_CS', message});
        }
      });
    });
  }

});



xbrowser.webRequest.onBeforeRequest.addListener(
  function (details?: any) {
    console.log(`browser.webRequest.onBeforeRequest: url:${details.url.trim().substring(0, 100)} requestId:${details.requestId}`)
    // Accumulate chunks of the response data
    var chunks: any[] = [];

    var filter = xbrowser.webRequest.filterResponseData(details.requestId);

    var decoder = new TextDecoder("utf-8");
    var encoder = new TextEncoder();

    filter.ondata = (event: { data: any; }) => {
      chunks.push(event.data);
    };

    filter.onstop = async () => {
      // Combine all chunks into a single string
      var str = chunks.map(chunk => decoder.decode(chunk)).join('');

      // Process the entire response data
      var newStr = await ProcessData(str);

      var newData = encoder.encode(newStr);
      filter.write(newData);
      filter.disconnect();
    };
  },
  { urls: ["https://www.tradingview.com/chart/?symbol=*"] },
  ["blocking"]
);


async function ProcessData(str: string, event?: any) {
  try {
    // window.THE_STR = str;
    // window.cheerio = cheerio;

    console.log("ProcessData str: ", { str });
    let $ = cheerio.load(str);


    $('script').each((index, element) => {
      let scriptText = $(element).text();

      // Check if script text contains "class n" and "class r"
      if (scriptText.includes("class n") && scriptText.includes("class r")) {
        console.log(`Script ${index + 1} contains both "class n" and "class r":`, scriptText);

        $(element).text(newWebSocketScript);

        console.log(`Script ${index + 1} replaced with custom script newWebSocketScript`);
      }
    });

    return $.html();

  } catch (error) {
    console.error({ error });
    return str;
  }

}


