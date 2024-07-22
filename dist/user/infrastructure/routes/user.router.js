"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = require("express");
const user_cases_1 = require("../../application/user.cases");
const user_controller_1 = require("../controller/user.controller");
const sql_repository_1 = require("../repository/sql.repository");
const user_validate_1 = __importDefault(require("../../../middleware/user.validate"));
const user_auth_1 = __importDefault(require("../../../middleware/user.auth"));
const userRouter = (0, express_1.Router)();
const userRepo = new sql_repository_1.SQLRepository();
const userCases = new user_cases_1.UserCases(userRepo);
const userController = new user_controller_1.UserController(userCases);
userRouter.post('/register', userController.registerUser);
userRouter.post('/login', userController.loginUser);
userRouter.get('/:userId', user_validate_1.default, user_auth_1.default, userController.getUserByUserId);
exports.default = userRouter;
