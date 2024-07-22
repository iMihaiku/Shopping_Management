"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = tokenValidation;
const server_logs_1 = require("../services/server.logs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function tokenValidation(req, res, next) {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ message: 'Token must be provided to access' });
    }
    const token = authToken.split(' ')[1];
    if (!token) {
        return res
            .status(401)
            .json({ message: 'Token may be Bearer and must be provided' });
    }
    if (!process.env.JWT_SECRET) {
        server_logs_1.Server.log('JWT_SECRET not found', server_logs_1.LogColor.Red);
        return res.status(500).json({ message: 'Bad server configuration' });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, authInfo) => {
        if (err) {
            server_logs_1.Server.log('The supplied token is not valid', server_logs_1.LogColor.Red);
            return res
                .status(403)
                .json({ message: 'The supplied token is not valid' });
        }
        const userId = authInfo.userId;
        const role = authInfo.role;
        if (!userId) {
            return res.status(403).json({ message: 'Invalid token payload' });
        }
        req.authInfo = { userId, role };
        next();
    });
}
