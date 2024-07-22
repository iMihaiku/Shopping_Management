"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = require("express");
const user_validate_1 = __importDefault(require("../../../middleware/user.validate"));
const sqlit_repository_1 = require("../repository/sqlit.repository");
const producto_cases_1 = require("../../../producto/application/producto.cases");
const producto_controller_1 = require("../controller/producto.controller");
const productoRouter = (0, express_1.Router)();
const productoRepo = new sqlit_repository_1.ProductoSQL();
const productoCases = new producto_cases_1.ProductoCases(productoRepo);
const productoController = new producto_controller_1.ProductoController(productoCases);
productoRouter.get('/:productoId', user_validate_1.default, productoController.buscarProductos);
productoRouter.put('/:productId', user_validate_1.default, productoController.updateProducto);
productoRouter.delete('/:productoId', user_validate_1.default, productoController.deleteProducto);
exports.default = productoRouter;
