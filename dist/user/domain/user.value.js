"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.TierAccount = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["USER"] = "USER";
    UserRole["GUEST"] = "GUEST";
})(UserRole || (exports.UserRole = UserRole = {}));
var TierAccount;
(function (TierAccount) {
    TierAccount["FREE"] = "FREE";
    TierAccount["BASIC"] = "BASIC";
    TierAccount["PREMIUM"] = "PREMIUM";
})(TierAccount || (exports.TierAccount = TierAccount = {}));
class User {
    id;
    username;
    email;
    password;
    role;
    endpoint;
    tokenUsage;
    tierAccount;
    constructor(id, username, email, password, role, endpoint, tokenUsage = 0, tierAccount = TierAccount.FREE) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.endpoint = endpoint;
        this.tokenUsage = tokenUsage;
        this.tierAccount = tierAccount;
    }
}
exports.User = User;
