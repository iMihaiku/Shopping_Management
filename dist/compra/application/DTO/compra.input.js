"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompraInput = void 0;
class CompraInput {
    comercioId;
    costeTotal;
    productos;
    constructor(comercioId, costeTotal, productos) {
        this.comercioId = comercioId;
        this.costeTotal = costeTotal;
        this.productos = productos;
    }
}
exports.CompraInput = CompraInput;
