"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
class UserController {
    userCases;
    constructor(userCases) {
        this.userCases = userCases;
        this.registerUser = this.registerUser.bind(this);
        this.getUserByUsername = this.getUserByUsername.bind(this);
        this.getUserByUserId = this.getUserByUserId.bind(this);
        this.loginUser = this.loginUser.bind(this);
    }
    async registerUser(req, res) {
        const { username, email, password } = req.body;
        try {
            await this.userCases.createUser(username, email, password);
            res.status(201).send(`User ${username} created`);
        }
        catch (error) {
            res.status(400).send(error.message);
        }
    }
    async getUserByUsername(req, res) {
        const { username } = req.params;
        const user = await this.userCases.getUserByUsername(username);
        if (user === null) {
            res.status(404).send('User not found');
            return;
        }
        res.status(200).send(user);
    }
    async getUserByUserId(req, res) {
        const { userId } = req.params;
        const user = await this.userCases.getUserByUserId(userId);
        if (user === null) {
            res.status(404).send('Usuario no encontrado');
            return;
        }
        res.status(200).send(user);
    }
    async loginUser(req, res) {
        const { username, password } = req.body;
        const user = await this.userCases.loginUser(username, password);
        if (user === null) {
            res.status(401).send('Las credenciales proporcionadas no son validas');
            return;
        }
        res.status(200).send(user);
    }
}
exports.UserController = UserController;
