"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = require("express");
const compra_sql_1 = require("../repository/compra.sql");
const compra_cases_1 = require("../../../compra/application/compra.cases");
const compra_controller_1 = require("../controller/compra.controller");
const user_auth_1 = __importDefault(require("../../../middleware/user.auth"));
const user_validate_1 = __importDefault(require("../../../middleware/user.validate"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const compraRouter = (0, express_1.Router)();
const compraRepo = new compra_sql_1.CompraSQL();
const compraCases = new compra_cases_1.ComprasCases(compraRepo);
const compraController = new compra_controller_1.CompraController(compraCases);
compraRouter.post('/crear', user_validate_1.default, compraController.createCompra);
compraRouter.post('/mapearFactura', user_validate_1.default, upload.single('factura'), compraController.mapearFactura);
compraRouter.get('/:compraId', user_validate_1.default, compraController.getCompraById);
compraRouter.get('/:userId', user_validate_1.default, user_auth_1.default, compraController.getCompraByUserId);
compraRouter.get('/todas/:userId', user_validate_1.default, user_auth_1.default, compraController.getComprasByUserId);
exports.default = compraRouter;
