"use strict";
/* @flow */
Object.defineProperty(exports, "__esModule", { value: true });
+getItem;
(function (key) {
  return Promise;
});
+removeItem;
(function (key) {
  return Promise;
});
+setItem;
(function (key, value) {
  return Promise;
});
function createStorage(type) {
  return {
    getItem: function (key) {
      if (typeof browser !== "undefined") {
        return browser.storage[type].get(key).then(function (value) {
          return value[key];
        });
      } else {
        return new Promise(function (resolve, reject) {
          chrome.storage[type].get(key, function (value) {
            if (chrome.runtime.lastError == null) {
              // Chrome Storage returns the value in an Object of with its original key. Unwrap the
              // value from the returned Object to match the `getItem` API.
              resolve(value[key]);
            } else {
              reject();
            }
          });
        });
      }
    },
    removeItem: function (key) {
      if (typeof browser !== "undefined") {
        return browser.storage[type].remove(key);
      } else {
        return new Promise(function (resolve, reject) {
          chrome.storage[type].remove(key, function () {
            if (chrome.runtime.lastError == null) {
              resolve();
            } else {
              reject(chrome.runtime.lastError);
            }
          });
        });
      }
    },
    setItem: function (key, value) {
      var _a;
      if (typeof browser !== "undefined") {
        return browser.storage[type].set(((_a = {}), (_a[key] = value), _a));
      } else {
        return new Promise(function (resolve, reject) {
          var _a;
          chrome.storage[type].set(
            ((_a = {}), (_a[key] = value), _a),
            function () {
              if (chrome.runtime.lastError == null) {
                resolve();
              } else {
                reject(chrome.runtime.lastError);
              }
            },
          );
        });
      }
    },
  };
}
exports.default = createStorage;
