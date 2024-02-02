//using this alturnative because primereact usecontext not working right?, figure it out later, #TODO

import { getBrowserApi, getBrowserType, xbrowser } from '../utils/browser';
import { storage } from 'webextension-polyfill';

async function changeTheme(themeColor){
    let dark = "/themes/soho-dark/theme.css";
    let light = "/themes/soho-light/theme.css";
    var themeLink = document.getElementById('theme-link');

    if (themeColor == "dark") {
        themeLink.href = dark;
        await setStorageItem({ isDarkTheme: true });
    }
    else {
        themeLink.href = light;
        await setStorageItem({ isDarkTheme: false });
    }
}

export async function toggleTheme() {
    var themeLink = document.getElementById('theme-link');
    if (themeLink) {
        var isDarkTheme = themeLink.href.includes("dark");

        if (isDarkTheme) {
            changeTheme("light")
        }
        else {
            changeTheme("dark")
        }

        let checkStorageTheme = await getStorageItem("isDarkTheme");
        console.debug({ checkStorageTheme });

    } else {
        console.error('Theme link element not found.');
    }
}

async function getStorageItem(name) {
    return new Promise(resolve => {
        xbrowser.storage.local.get(name, result => {
            resolve(result);
        });
    });
}

async function setStorageItem(obj) {
    return new Promise(resolve => {
        xbrowser.storage.local.set(obj, result => {
            resolve(result);
        });
    });
}

export async function initTheme() {
    const get = await getStorageItem("isDarkTheme");
    let isDarkTheme = get.isDarkTheme;

    let testList = await getStorageItem("testList");

    console.log("initTheme() isDarkTheme:", isDarkTheme, { testList: testList.testList });

    if (isDarkTheme === undefined) {
        console.debug("isDarkTheme is undefined");
        await setStorageItem({ 'isDarkTheme': true });
    }

    if (isDarkTheme == false) {
        await changeTheme("light");
    }

    if (isDarkTheme == true) {
        await changeTheme("dark");
    }

    let checkStorageTheme = await getStorageItem("isDarkTheme");
    console.debug({ checkStorageTheme });
}