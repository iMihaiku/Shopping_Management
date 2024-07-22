"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compra_router_1 = __importDefault(require("./compra/infrastructure/routes/compra.router"));
const producto_route_1 = __importDefault(require("./producto/infrastructure/routes/producto.route"));
const server_logs_1 = require("./services/server.logs");
const user_router_1 = __importDefault(require("./user/infrastructure/routes/user.router"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use('/users', user_router_1.default);
app.use('/compras', compra_router_1.default);
app.use('/productos', producto_route_1.default);
app.listen(port, () => {
    server_logs_1.Server.log(`Server on ==> http://localhost:${port}`);
});
