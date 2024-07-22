"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompraOutput = void 0;
class CompraOutput {
    comercio;
    fecha;
    costeTotal;
    productos;
    constructor(comercio, fecha, costeTotal, productos) {
        this.comercio = comercio;
        this.fecha = fecha;
        this.costeTotal = costeTotal;
        this.productos = productos;
    }
}
exports.CompraOutput = CompraOutput;
