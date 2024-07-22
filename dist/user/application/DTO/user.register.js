"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRegisterDTO = void 0;
class UserRegisterDTO {
    id;
    username;
    email;
    role;
    constructor(id, username, email, role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }
}
exports.UserRegisterDTO = UserRegisterDTO;
