"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compra = void 0;
class Compra {
    id;
    userId;
    fecha;
    comercioId;
    costeTotal;
    productos;
    constructor(id, userId, fecha, comercioId, costeTotal, productos) {
        this.id = id;
        this.userId = userId;
        this.fecha = fecha;
        this.comercioId = comercioId;
        this.costeTotal = costeTotal;
        this.productos = productos;
    }
}
exports.Compra = Compra;
