"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authValidation;
const user_value_1 = require("../user/domain/user.value");
function authValidation(req, res, next) {
    const { userId, role } = req.authInfo;
    if (!userId && !role) {
        return res.status(403).json({ message: 'Invalid token payload' });
    }
    const isAdmin = role === user_value_1.UserRole.ADMIN;
    if (userId !== req.params.userId && !isAdmin) {
        return res
            .status(403)
            .json({ message: 'You are not authorized to access this resource' });
    }
    next();
}
