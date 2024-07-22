"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tursoClient = void 0;
const client_1 = require("@libsql/client");
exports.tursoClient = (0, client_1.createClient)({
    url: process.env.TURSO_URL ?? 'URL No Establecida',
    authToken: process.env.TURSO_AUTH_TOKEN
});
