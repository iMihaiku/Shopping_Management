"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductosDTO = void 0;
class ProductosDTO {
    nombre;
    precio;
    categoria;
    constructor(nombre, precio, categoria) {
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
    }
}
exports.ProductosDTO = ProductosDTO;
