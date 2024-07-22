"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCases = void 0;
const nanoid_1 = require("nanoid");
const user_value_1 = require("../domain/user.value");
const bcrypt_handle_1 = require("../../services/bcrypt/bcrypt.handle");
const user_login_1 = require("./DTO/user.login");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserCases {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(username, email, password) {
        const newId = (0, nanoid_1.nanoid)(10);
        const passwordHash = await (0, bcrypt_handle_1.encrypt)(password);
        const user = new user_value_1.User(newId, username, email, passwordHash, user_value_1.UserRole.USER, '', 0, user_value_1.TierAccount.FREE);
        await this.userRepository.createUser(user);
        return null;
    }
    async getUserByUsername(username) {
        return await this.userRepository.getUserByUsername(username);
    }
    async getUserByUserId(userId) {
        return await this.userRepository.getUserByUserId(userId);
    }
    async loginUser(username, password) {
        const user = await this.userRepository.getUserByUsername(username);
        if (user === null) {
            return null;
        }
        const isValid = await (0, bcrypt_handle_1.compare)(password, user.password);
        if (!isValid) {
            return null;
        }
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET no está definido');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });
        const userDTO = new user_login_1.UserLoginDTO(user.id, token, user.role.toString(), user.tokenUsage || 0, user.tierAccount);
        console.log(userDTO, 'userDTO');
        return userDTO;
    }
}
exports.UserCases = UserCases;
