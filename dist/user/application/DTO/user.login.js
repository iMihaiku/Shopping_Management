"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLoginDTO = void 0;
class UserLoginDTO {
    id;
    tokenJWT;
    role;
    tokenUsage;
    tierAccount;
    constructor(id, tokenJWT, role, tokenUsage, tierAccount) {
        this.id = id;
        this.tokenJWT = tokenJWT;
        this.role = role;
        this.tokenUsage = tokenUsage;
        this.tierAccount = tierAccount;
    }
}
exports.UserLoginDTO = UserLoginDTO;
