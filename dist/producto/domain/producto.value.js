"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaProducto = exports.Producto = void 0;
class Producto {
    id;
    nombre;
    precio;
    comercioId;
    categoria;
    constructor(id, nombre, precio, comercioId, categoria) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.comercioId = comercioId;
        this.categoria = categoria ? [categoria] : [];
    }
}
exports.Producto = Producto;
class CategoriaProducto {
    id;
    nombre;
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
    }
}
exports.CategoriaProducto = CategoriaProducto;
