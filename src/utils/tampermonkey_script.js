// ==UserScript==
// @name         Example Script for example.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Injects JavaScript on example.com and www.example.com after page load
// @author       You
// @match        https://tradingview.com/chart/*
// @match        https://www.tradingview.com/chart/*
// @grant        none
// ==/UserScript==

const delay = (milliseconds) => {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
};


function StartNewWS() {
    "use strict";

    function e(e, t = !1) {
        const {
            searchParams: s
        } = new URL(String(location));
        let n = "true" === s.get("mobileapp_new"),
            o = "true" === s.get("mobileapp");
        if (!t) {
            const e = function (e) {
                const t = e + "=",
                    s = document.cookie.split(";");
                for (let e = 0; e < s.length; e++) {
                    let n = s[e];
                    for (;
                        " " === n.charAt(0);) n = n.substring(1, n.length);
                    if (0 === n.indexOf(t)) return n.substring(t.length, n.length)
                }
                return null
            }("tv_app") || "";
            n || (n = ["android", "android_nps"].includes(e)), o || (o = "ios" === e)
        }
        return !("new" !== e && "any" !== e || !n) || !("new" === e || !o)
    }
    const t = () => { },
        s = "~m~";
    class n {
        constructor(e, t = {}) {
            this.sessionid = null, this.connected = !1, this._timeout = null, this._base = e, this._options = {
                timeout: t.timeout || 2e4,
                connectionType: t.connectionType
            }
        }
        connect() {
            this._socket = new WebSocket(this._prepareUrl()), this._socket.onmessage = e => {
                if ("string" != typeof e.data) throw new TypeError(`The WebSocket message should be a string. Recieved ${Object.prototype.toString.call(e.data)}`);
                this._onData(e.data)
            }, this._socket.onclose = this._onClose.bind(this), this._socket.onerror = this._onError.bind(this)
        }
        send(e) {
            this._socket && this._socket.send(this._encode(e))
        }
        disconnect() {
            this._clearIdleTimeout(), this._socket && (this._socket.onmessage = t, this._socket.onclose = t, this._socket.onerror = t, this._socket.close())
        }
        _clearIdleTimeout() {
            null !== this._timeout && (clearTimeout(this._timeout), this._timeout = null)
        }
        _encode(e) {
            let t, o = "";
            const i = Array.isArray(e) ? e : [e],
                c = i.length;
            for (let e = 0; e < c; e++) t = null === i[e] || void 0 === i[e] ? "" : n._stringify(i[e]), o += s + t.length + s + t;
            return o
        }
        _decode(e) {
            const t = [];
            let n, o;
            do {
                if (e.substring(0, 3) !== s) return t;
                n = "", o = "";
                const i = (e = e.substring(3)).length;
                for (let t = 0; t < i; t++) {
                    if (o = Number(e.substring(t, t + 1)), Number(e.substring(t, t + 1)) !== o) {
                        e = e.substring(n.length + s.length), n = Number(n);
                        break
                    }
                    n += o
                }
                t.push(e.substring(0, n)), e = e.substring(n)
            } while ("" !== e);
            return t
        }
        _onData(e) {
            this._setTimeout();
            const t = this._decode(e),
                s = t.length;
            for (let e = 0; e < s; e++) this._onMessage(t[e])
        }
        _setTimeout() {
            this._clearIdleTimeout(), this._timeout = setTimeout(this._onTimeout.bind(this), this._options.timeout)
        }
        _onTimeout() {
            this.disconnect(), this._onDisconnect({
                code: 4e3,
                reason: "socket.io timeout",
                wasClean: !1
            })
        }
        _onMessage(e) {
            console.debug(">>> c _onMessage e: ", e);
            this.sessionid ? this._checkIfHeartbeat(e) ? this._onHeartbeat(e.slice(3)) : this._checkIfJson(e) ? this._base.onMessage(JSON.parse(e.slice(3))) : this._base.onMessage(e) : (this.sessionid = e, this._onConnect())
        }
        _checkIfHeartbeat(e) {
            return this._checkMessageType(e, "h")
        }
        _checkIfJson(e) {
            return this._checkMessageType(e, "j")
        }
        _checkMessageType(e, t) {
            return e.substring(0, 3) === "~" + t + "~"
        }
        _onHeartbeat(e) {
            this.send("~h~" + e)
        }
        _onConnect() {
            this.connected = !0, this._base.onConnect()
        }
        _onDisconnect(e) {
            this._clear(), this._base.onDisconnect(e), this.sessionid = null
        }
        _clear() {
            this.connected = !1
        }
        _prepareUrl() {
            const t = i(this._base.host);
            if (t.pathname += "socket.io/websocket", t.protocol = "wss:", t.searchParams.append("from", window.location.pathname.slice(1, 50)), t.searchParams.append("date", window.BUILD_TIME || ""), e("any") && t.searchParams.append("client", "mobile"), this._options.connectionType && t.searchParams.append("type", this._options.connectionType),
                window.WEBSOCKET_PARAMS_ANALYTICS) {
                const {
                    ws_page_uri: e,
                    ws_ancestor_origin: s
                } = window.WEBSOCKET_PARAMS_ANALYTICS;
                e && t.searchParams.append("page-uri", e), s && t.searchParams.append("ancestor-origin", s)
            }
            return t.href
        }
        _onClose(e) {
            this._clearIdleTimeout(), this._onDisconnect(e)
        }
        _onError(e) {
            this._clearIdleTimeout(), this._clear(), this._base.emit("error", [e]), this.sessionid = null
        }
        static _stringify(e) {
            return "[object Object]" === Object.prototype.toString.call(e) ? "~j~" + JSON.stringify(e) : String(e)
        }
    }
    class o {
        constructor(e, t) {
            this.host = e, this._connecting = !1, this._events = {}, this.transport = this._getTransport(t)
        }
        isConnected() {
            return !!this.transport && this.transport.connected
        }
        isConnecting() {
            return this._connecting
        }
        connect() {
            console.debug(">>> o connect");
            this.isConnected() || (this._connecting && this.disconnect(), this._connecting = !0, this.transport.connect())
        }
        send(e) {
            this.transport && this.transport.connected && this.transport.send(e)
        }
        disconnect() {
            this.transport && this.transport.disconnect()
        }
        on(e, t) {
            e in this._events || (this._events[e] = []), this._events[e].push(t)
        }
        offAll() {
            this._events = {}
        }
        onMessage(e) {
            console.debug(">>> o onMessage e: ", e);
            this.emit("message", [e])
        }
        emit(e, t = []) {
            if (e in this._events) {
                const s = this._events[e].concat(),
                    n = s.length;
                for (let e = 0; e < n; e++) s[e].apply(this, t)
            }
        }
        onConnect() {
            this.clear(), this.emit("connect")
        }
        onDisconnect(e) {
            this.emit("disconnect", [e])
        }
        clear() {
            this._connecting = !1
        }
        _getTransport(e) {
            return new n(this, e)
        }
    }

    function i(e) {
        const t = -1 !== e.indexOf("/") ? new URL(e) : new URL("wss://" + e);
        if ("wss:" !== t.protocol && "https:" !== t.protocol) throw new Error("Invalid websocket base " + e);
        return t.pathname.endsWith("/") || (t.pathname += "/"), t.search = "", t.username = "", t.password = "", t
    }
    const c = Number(window.TELEMETRY_WS_ERROR_LOGS_THRESHOLD) || 0;
    class r {
        constructor(e, t = {}) {
            this._queueStack = [], this._logsQueue = [], this._telemetryObjectsQueue = [], this._reconnectCount = 0, this._redirectCount = 0, this._errorsCount = 0, this._errorsInfoSent = !1, this._connectionStart = null, this._connectionEstablished = null, this._reconnectTimeout = null, this._onlineCancellationToken = null, this._isConnectionForbidden = !1, this._initialHost = t.initialHost || null, this._suggestedHost = e, this._proHost = t.proHost, this._reconnectHost = t.reconnectHost, this._noReconnectAfterTimeout = !0 === t.noReconnectAfterTimeout, this._dataRequestTimeout = t.dataRequestTimeout, this._connectionType = t.connectionType, this._doConnect(), t.pingRequired && -1 === window.location.search.indexOf("noping") && this._startPing()
        }
        connect() {
            this._tryConnect()
        }
        resetCounters() {
            this._reconnectCount = 0, this._redirectCount = 0
        }
        setLogger(e, t) {
            this._logger = e, this._getLogHistory = t, this._flushLogs()
        }
        setTelemetry(e) {
            this._telemetry = e, this._telemetry.reportSent.subscribe(this, this._onTelemetrySent), this._flushTelemetry()
        }
        onReconnect(e) {
            this._onReconnect = e
        }
        isConnected() {
            return !!this._socket && this._socket.isConnected()
        }
        isConnecting() {
            return !!this._socket && this._socket.isConnecting()
        }
        on(e, t) {
            return !!this._socket && ("connect" === e && this._socket.isConnected() ? t() : "disconnect" === e ? this._disconnectCallbacks.push(t) : this._socket.on(e, t), !0)
        }
        getSessionId() {
            return this._socket && this._socket.transport ? this._socket.transport.sessionid : null
        }
        send(e) {
            return this.isConnected() ? (this._socket.send(e), !0) : (this._queueMessage(e), !1)
        }
        getConnectionEstablished() {
            return this._connectionEstablished
        }
        getHost() {
            const e = this._tryGetProHost();
            return null !== e ? e : this._reconnectHost && this._reconnectCount > 3 ? this._reconnectHost : this._suggestedHost
        }
        getReconnectCount() {
            return this._reconnectCount
        }
        getRedirectCount() {
            return this._redirectCount
        }
        getConnectionStart() {
            return this._connectionStart
        }
        disconnect() {
            this._clearReconnectTimeout(), (this.isConnected() || this.isConnecting()) && (this._propagateDisconnect(), this._disconnectCallbacks = [], this._closeSocket())
        }
        forbidConnection() {
            this._isConnectionForbidden = !0, this.disconnect()
        }
        allowConnection() {
            this._isConnectionForbidden = !1, this.connect()
        }
        isMaxRedirects() {
            return this._redirectCount >= 20
        }
        isMaxReconnects() {
            return this._reconnectCount >= 20
        }
        getPingInfo() {
            return this._pingInfo || null
        }
        _tryGetProHost() {
            return window.TradingView && window.TradingView.onChartPage && "battle" === window.environment && !this._redirectCount && -1 === window.location.href.indexOf("ws_host") ? this._initialHost ? this._initialHost : void 0 !== window.user && window.user.pro_plan ? this._proHost || this._suggestedHost : null : null
        }
        _queueMessage(e) {
            0 === this._queueStack.length && this._logMessage(0, "Socket is not connected. Queued a message"), this._queueStack.push(e)
        }
        _processMessageQueue() {
            0 !== this._queueStack.length && (this._logMessage(0, "Processing queued messages"), this._queueStack.forEach(this.send.bind(this)), this._logMessage(0, "Processed " + this._queueStack.length + " messages"), this._queueStack = [])
        }
        _onDisconnect(e) {
            this._noReconnectAfterTimeout || null !== this._reconnectTimeout || (this._reconnectTimeout = setTimeout(this._tryReconnect.bind(this), 5e3)), this._clearOnlineCancellationToken();
            let t = "disconnect session:" + this.getSessionId();
            e && (t += ", code:" + e.code + ", reason:" + e.reason, 1005 === e.code && this._sendTelemetry("websocket_code_1005")), this._logMessage(0, t), this._propagateDisconnect(e), this._closeSocket(), this._queueStack = []
        }
        _closeSocket() {
            null !== this._socket && (this._socket.offAll(), this._socket.disconnect(), this._socket = null)
        }
        _logMessage(e, t) {
            const s = {
                method: e,
                message: t
            };
            this._logger ? this._flushLogMessage(s) : (s.message = `[${(new Date).toISOString()}] ${s.message}`, this._logsQueue.push(s))
        }
        _flushLogMessage(e) {
            switch (e.method) {
                case 2:
                    this._logger.logDebug(e.message);
                    break;
                case 3:
                    this._logger.logError(e.message);
                    break;
                case 0:
                    this._logger.logInfo(e.message);
                    break;
                case 1:
                    this._logger.logNormal(e.message)
            }
        }
        _flushLogs() {
            this._flushLogMessage({
                method: 1,
                message: "messages from queue. Start."
            }), this._logsQueue.forEach((e => {
                this._flushLogMessage(e)
            })), this._flushLogMessage({
                method: 1,
                message: "messages from queue. End."
            }), this._logsQueue = []
        }
        _sendTelemetry(e, t) {
            const s = {
                event: e,
                params: t
            };
            this._telemetry ? this._flushTelemetryObject(s) : this._telemetryObjectsQueue.push(s)
        }
        _flushTelemetryObject(e) {
            this._telemetry.sendChartReport(e.event, e.params, !1)
        }
        _flushTelemetry() {
            this._telemetryObjectsQueue.forEach((e => {
                this._flushTelemetryObject(e)
            })), this._telemetryObjectsQueue = []
        }
        _doConnect() {
            this._socket && (this._socket.isConnected() || this._socket.isConnecting()) || (this._clearOnlineCancellationToken(), this._host = this.getHost(), this._socket = new o(this._host, {
                timeout: this._dataRequestTimeout,
                connectionType: this._connectionType
            }), this._logMessage(0, "Connecting to " + this._host), this._bindEvents(), this._disconnectCallbacks = [], this._connectionStart = performance.now(), this._connectionEstablished = null, this._socket.connect(), performance.mark("SWSC", {
                detail: "Start WebSocket connection"
            }), this._socket.on("connect", (() => {
                performance.mark("EWSC", {
                    detail: "End WebSocket connection"
                }), performance.measure("WebSocket connection delay", "SWSC", "EWSC")
            })))
        }
        _propagateDisconnect(e) {
            const t = this._disconnectCallbacks.length;
            for (let s = 0; s < t; s++) this._disconnectCallbacks[s](e || {})
        }
        _bindEvents() {
            this._socket && (this._socket.on("connect", (() => {
                const e = this.getSessionId();
                if ("string" == typeof e) {
                    const t = JSON.parse(e);
                    if (t.redirect) return this._redirectCount += 1, this._suggestedHost = t.redirect, this.isMaxRedirects() && this._sendTelemetry("redirect_bailout"), void this._redirect()
                }
                this._connectionEstablished = performance.now(), this._processMessageQueue(), this._logMessage(0, "connect session:" + e)
            })), this._socket.on("disconnect", this._onDisconnect.bind(this)), this._socket.on("close", this._onDisconnect.bind(this)), this._socket.on("error", (e => {
                this._logMessage(0, new Date + " session:" + this.getSessionId() + " websocket error:" + JSON.stringify(e)), this._sendTelemetry("websocket_error"), this._errorsCount++, !this._errorsInfoSent && this._errorsCount >= c && (void 0 !== this._lastConnectCallStack && (this._sendTelemetry("websocket_error_connect_stack", {
                    text: this._lastConnectCallStack
                }), delete this._lastConnectCallStack), void 0 !== this._getLogHistory && this._sendTelemetry("websocket_error_log", {
                    text: this._getLogHistory(50).join("\n")
                }), this._errorsInfoSent = !0)
            })))
        }
        _redirect() {
            this.disconnect(), this._reconnectWhenOnline()
        }
        _tryReconnect() {
            this._tryConnect() && (this._reconnectCount += 1)
        }
        _tryConnect() {
            return !this._isConnectionForbidden && (this._clearReconnectTimeout(), this._lastConnectCallStack = new Error(`WebSocket connect stack. Is connected: ${this.isConnected()}.`).stack || "", !this.isConnected() && (this.disconnect(), this._reconnectWhenOnline(), !0))
        }
        _clearOnlineCancellationToken() {
            this._onlineCancellationToken && (this._onlineCancellationToken(), this._onlineCancellationToken = null)
        }
        _clearReconnectTimeout() {
            null !== this._reconnectTimeout && (clearTimeout(this._reconnectTimeout), this._reconnectTimeout = null)
        }
        _reconnectWhenOnline() {
            if (navigator.onLine) return this._logMessage(0, "Network status: online - trying to connect"), this._doConnect(), void (this._onReconnect && this._onReconnect());
            this._logMessage(0, "Network status: offline - wait until online"), this._onlineCancellationToken = function (e) {
                let t = e;
                const s = () => {
                    window.removeEventListener("online", s), t && t()
                };
                return window.addEventListener("online", s), () => {
                    t = null
                }
            }((() => {
                this._logMessage(0, "Network status changed to online - trying to connect"), this._doConnect(), this._onReconnect && this._onReconnect()
            }))
        }
        _onTelemetrySent(e) {
            "websocket_error" in e && (this._errorsCount = 0, this._errorsInfoSent = !1)
        }
        _startPing() {
            if (this._pingIntervalId) return;
            const e = i(this.getHost());
            e.pathname += "ping", e.protocol = "https:";
            let t = 0,
                s = 0;
            const n = e => {
                this._pingInfo = this._pingInfo || {
                    max: 0,
                    min: 1 / 0,
                    avg: 0
                };
                const n = (new Date).getTime() - e;
                n > this._pingInfo.max && (this._pingInfo.max = n), n < this._pingInfo.min && (this._pingInfo.min = n), t += n, s++, this._pingInfo.avg = t / s, s >= 10 && this._pingIntervalId && (clearInterval(this._pingIntervalId), delete this._pingIntervalId)
            };
            this._pingIntervalId = setInterval((() => {
                const t = (new Date).getTime(),
                    s = new XMLHttpRequest;
                s.open("GET", e, !0), s.send(), s.onreadystatechange = () => {
                    s.readyState === XMLHttpRequest.DONE && 200 === s.status && n(t)
                }
            }), 1e4)
        }
    }


    window.WSBackendConnection = new r(window.WEBSOCKET_HOST, {
        pingRequired: window.WS_HOST_PING_REQUIRED,
        proHost: window.WEBSOCKET_PRO_HOST,
        reconnectHost: window.WEBSOCKET_HOST_FOR_RECONNECT,
        initialHost: window.WEBSOCKET_INITIAL_HOST,
        connectionType: window.WEBSOCKET_CONNECTION_TYPE
    });
}




(function () {
    'use strict';

    function injectScript() {
        // Your JavaScript code to be injected goes here
        console.log("Injected script is running!");
        console.log({ window });
        let WS = window.WSBackendConnection
        console.log("window.WSBackendConnection: ", { WS });

        console.log({
            pingRequired: window.WS_HOST_PING_REQUIRED,
            proHost: window.WEBSOCKET_PRO_HOST,
            reconnectHost: window.WEBSOCKET_HOST_FOR_RECONNECT,
            initialHost: window.WEBSOCKET_INITIAL_HOST,
            connectionType: window.WEBSOCKET_CONNECTION_TYPE
        });

        window.WSBackendConnection.disconnect();
        // window.WSBackendConnection = null;
        // StartNewWS();

        MoreShit();
    }

    function waitForPageLoad() {
        if (document.readyState === 'complete') {
            // Page is fully loaded, wait an additional 2 seconds
            setTimeout(injectScript, 10);
        } else {
            // Continue waiting for the page to load
            setTimeout(waitForPageLoad, 50);
        }
    }
    waitForPageLoad();
})();


function MoreShit() {
    waitForWebSockets();

    function waitForWebSockets() {
        if (window.WebSocket) {
            // WebSocket exists, try to hook into it
            hookWebSockets();
        } else {
            // WebSocket might not be available yet, check again
            setTimeout(waitForWebSockets, 50);
        }
    }

    function hookWebSockets() {
        // Attempt to intercept WebSocket creation
        Object.defineProperty(window, 'WebSocket', {
            get: function () {
                return new Proxy(WebSocket, {
                    apply: function (target, thisArg, args) {
                        const originalWS = Reflect.apply(target, thisArg, args);
                        const wrappedWS = new Proxy(originalWS, {
                            onmessage: function (event) {
                                console.log("WebSocket message received:", event.data);
                                return Reflect.apply(originalWS.onmessage, originalWS, [event]);
                            }
                        });
                        return wrappedWS;
                    }
                });
            }
        });

        // Also try to hook existing WebSocket instances
        for (const key in window) {
            console.log("loop in key in window: ", {key});
            if (window.hasOwnProperty(key) && window[key] instanceof WebSocket) {
                const existingWS = window[key];
                console.log({existingWS});
                window[key] = new Proxy(existingWS, {
                    onmessage: function (event) {
                        console.log("WebSocket message received (existing):", event.data);
                        return Reflect.apply(existingWS.onmessage, existingWS, [event]);
                    }
                });
            }
        }
    }
}