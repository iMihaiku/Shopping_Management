"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLRepository = void 0;
const turso_1 = require("../../../services/db/turso");
const server_logs_1 = require("../../../services/server.logs");
const user_value_1 = require("../../domain/user.value");
class SQLRepository {
    async createUser(user) {
        if (await this.checkUsernameExists(user.username)) {
            throw new Error('Username already exists');
        }
        await turso_1.tursoClient.execute({
            sql: 'INSERT INTO users (id, username, email, password, role) VALUES (:id, :username, :email, :password, :role)',
            args: {
                id: user.id,
                username: user.username,
                password: user.password,
                email: user.email,
                role: user.role
            }
        });
        server_logs_1.Server.log(`User ${user.username} created with id: ${user.id}`, server_logs_1.LogColor.Green);
    }
    async getUserByUsername(username) {
        const resultSet = await this.searchUsername(username);
        if (resultSet.rows.length === 0)
            return null;
        const row = resultSet.rows[0];
        return this.mapUser(row);
    }
    async getUserByUserId(userId) {
        const resultSet = await this.searchUserId(userId);
        if (resultSet.rows.length === 0)
            return null;
        const row = resultSet.rows[0];
        return this.mapUser(row);
    }
    async searchUsername(username) {
        const resultSet = await turso_1.tursoClient.execute({
            sql: 'SELECT * FROM users WHERE username = :username',
            args: {
                username
            }
        });
        return resultSet;
    }
    async searchUserId(userId) {
        const resultSet = await turso_1.tursoClient.execute({
            sql: 'SELECT * FROM users WHERE id = :userId',
            args: {
                userId
            }
        });
        return resultSet;
    }
    async checkUsernameExists(username) {
        const resultSet = await this.searchUsername(username);
        return resultSet.rows.length > 0;
    }
    mapUser(row) {
        return new user_value_1.User(row.id, row.username, row.email, row.password, row.role, row.endpoint, row.tokenUsage, row.tierAccount);
    }
}
exports.SQLRepository = SQLRepository;
