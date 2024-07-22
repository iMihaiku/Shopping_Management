"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductoCases = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-argument */
const server_logs_1 = require("../../services/server.logs");
const producto_value_1 = require("../domain/producto.value");
const producto_output_1 = require("./DTO/producto.output");
class ProductoCases {
    productoRepository;
    constructor(productoRepository) {
        this.productoRepository = productoRepository;
    }
    async updateProducto(productId, producto, userId) {
        const productoInput = new producto_value_1.Producto(productId, producto.nombre, producto.precio, producto.comercioId, producto.categoria);
        let productoActualizado;
        try {
            productoActualizado = await this.productoRepository.updateProducto(productoInput);
        }
        catch (error) {
            return { message: 'Producto no encontrado' };
        }
        if (productoActualizado.rows.length === 0) {
            return { message: 'Producto no encontrado' };
        }
        server_logs_1.Server.log('Producto actualizado: ' + producto.nombre + ' por el usuario: ' + userId, server_logs_1.LogColor.Green);
        return { message: 'Producto actualizado', producto };
    }
    async deleteProducto(id, userId) {
        try {
            await this.productoRepository.deleteProducto(id);
            server_logs_1.Server.log('Producto con id: ' + id + ' eliminado por parte del usuario: ' + userId, server_logs_1.LogColor.Green);
            return { message: 'Producto eliminado' };
        }
        catch (error) {
            return { message: 'Producto no encontrado' };
        }
    }
    async createProducto(producto) {
        await this.productoRepository.createProducto(producto);
    }
    async buscarProductos(p, c, filtro, parametro) {
        const productosRS = await this.productoRepository.buscarProductos(p, c, filtro, parametro);
        const categorias = await this.productoRepository._getCategorias();
        const productosOutput = productosRS.map((producto) => {
            return new producto_output_1.ProductosOutput(producto.nombre, producto.precio.toString(), this._setCategoria(producto.categoriaId, categorias));
        });
        return productosOutput;
    }
    _setCategoria(categoriaId, categorias) {
        const categoria = [];
        const categoriasArray = categoriaId ? categoriaId.split(',') : [];
        if (categoriasArray.length > 0) {
            categoriasArray.forEach((id) => {
                categoria.push({
                    id,
                    nombre: categorias[id]
                });
            });
        }
        return categoria;
    }
}
exports.ProductoCases = ProductoCases;
