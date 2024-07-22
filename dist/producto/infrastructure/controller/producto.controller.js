"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductoController = void 0;
class ProductoController {
    compraCases;
    constructor(compraCases) {
        this.compraCases = compraCases;
        this.buscarProductos = this.buscarProductos.bind(this);
        this.updateProducto = this.updateProducto.bind(this);
        this.deleteProducto = this.deleteProducto.bind(this);
    }
    async buscarProductos(req, res) {
        const { p = '50', c = '0', filtro = '', parametro = '' } = req.query;
        const result = await this.compraCases.buscarProductos(p, c, filtro, parametro);
        res.status(201).json({ productos: result });
    }
    async updateProducto(req, res) {
        const { producto } = req.body;
        const { productId } = req.params;
        const mensaje = await this.compraCases.updateProducto(productId, producto, req.authInfo.userId);
        res.status(200).json(mensaje);
    }
    async deleteProducto(req, res) {
        const { productoId } = req.params;
        const mensaje = await this.compraCases.deleteProducto(productoId, req.authInfo.userId);
        res.status(200).json(mensaje);
    }
}
exports.ProductoController = ProductoController;
