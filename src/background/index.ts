import { runtime, tabs, storage } from 'webextension-polyfill';
import { delay, formatCurrentTime } from '../utils/common';
import { getBrowserApi, getBrowserType } from '../utils/browser'

console.log('background is running');
console.log('Extension ID:', runtime.id);
console.log('runtime.getURL("")', runtime.getURL("")+"home.html");

const xbrowser = getBrowserApi();

xbrowser.runtime.onMessage.addListener((request: { type: string; count: any; }) => {
  if (request.type === 'COUNT') {
    console.log('background has received a message from popup, and count is ', request?.count);
  }
})


xbrowser.runtime.onMessage.addListener((request: { type: string; message?: any; }) => {
  if (request.type === 'TEST_MESSAGE') {
    console.log('background has received a message TEST_MESSAGE ', request?.message);
  }
})
