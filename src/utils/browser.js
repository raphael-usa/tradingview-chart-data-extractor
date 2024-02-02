
export const getBrowserType = () => {
    if (typeof chrome !== "undefined") {
        if (typeof browser !== "undefined") {
            console.debug("getBrowserType using firefox, ", { browser });
            return "firefox";
        } else {
            console.debug("getBrowserType using chrome, ", { chrome })
            return "chrome";
        }
    } else {
        console.debug("getBrowserType using edge or something else?")
        return false;
    }
};

export const getBrowserApi = () => {
    let browserName = getBrowserType();
    if (browserName == "firefox") {
        return browser;
    }
    else if (browserName == "chrome") {
        return chrome;
    }
    else {
        return browser; //error?
    }
};

export const xbrowser = getBrowserApi();