import { xbrowser } from '../utils/browser'

import * as cheerio from 'cheerio';

import {newWebSocketScript} from './newWebSocketScript.js';

console.log('background is running');
const htmlString = '<h2 class="title">Hello world</h2>';
var $ = cheerio.load(htmlString);

console.log({ htmlString }, "S: ", $);


xbrowser.runtime.onMessage.addListener(async (request: { type: string; message?: any; }) => {
  if (request.type === 'TEST_MESSAGE') {
    console.log('background has received a message TEST_MESSAGE ', request?.message);
  }
  if (request.type === 'INJECT_JS_TRADINGVIEW') {
    console.log('background has received a message INJECT_JS_TRADINGVIEW ', { message: request?.message });

    // try {
    //   xbrowser.tabs.query({ active: true, currentWindow: true }, (tabs?: any) => {
    //     const tab = tabs[0];
    //     console.log({tab});
    //     xbrowser.scripting.executeScript({
    //       target: {
    //         tabId: tab.id,
    //         allFrames: true,
    //       },
    //       files: ["tv.js"],
    //     });
    //   });

    //   return true;
    // } catch (err) {
    //   console.error(`failed to execute script: ${err}`);
    // }
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

        console.log(`Script ${index + 1} replaced with custom script:`, newWebSocketScript);
      } 
    });

    return $.html();

  } catch (error) {
    console.error({ error });
    return str;
  }

} 