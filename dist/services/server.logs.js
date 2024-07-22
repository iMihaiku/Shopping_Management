"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = exports.LogColor = void 0;
/* eslint-disable @typescript-eslint/no-extraneous-class */
var LogColor;
(function (LogColor) {
    LogColor["Green"] = "\u001B[32m";
    LogColor["Red"] = "\u001B[31m";
    LogColor["Yellow"] = "\u001B[33m";
    LogColor["Blue"] = "\u001B[34m";
    LogColor["Magenta"] = "\u001B[35m";
    LogColor["Cyan"] = "\u001B[36m";
    LogColor["White"] = "\u001B[37m";
    LogColor["Black"] = "\u001B[30m";
    LogColor["Reset"] = "\u001B[0m";
})(LogColor || (exports.LogColor = LogColor = {}));
class Server {
    static log(message, color = LogColor.Yellow) {
        const timeStamp = new Date().toISOString();
        const colorCode = color;
        console.log(`${colorCode}%s${LogColor.Reset}`, timeStamp + ' || ' + message);
    }
}
exports.Server = Server;
