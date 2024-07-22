"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComprasCases = void 0;
class ComprasCases {
    compraRepository;
    constructor(compraRepository) {
        this.compraRepository = compraRepository;
    }
    async createCompra(compra) {
        await this.compraRepository.createCompra(compra);
    }
    async mapearFactura(factura) {
        await this.compraRepository.mapearFactura(factura);
    }
    async getUsuarioById(userId) {
        const result = await this.compraRepository.getUsuarioById(userId);
        if (result.rows.length === 0) {
            throw new Error('Usuario no encontrado');
        }
        const usuario = result.rows[0].map((user) => {
            return {
                endpoint: user.endpoint,
                tokenUsage: user.tokenUsage
            };
        });
        return usuario;
    }
    async getComprasByUserId(userId, filtro, parametro) {
        const res = await this.compraRepository.getComprasByUserId(userId, filtro, parametro);
        const categorias = await this.compraRepository.getCategorias();
        const comercios = await this.compraRepository.getComercios();
        const productos = res.rows.map((producto) => {
            return {
                id: producto.productoId,
                compraId: producto.compraId,
                comercioId: producto.comercioId,
                nombre: producto.nombre,
                precio: producto.precio,
                fecha: new Date(producto.fecha),
                costeTotal: producto.costeTotal,
                categoria: this.setCategoria(producto.categoriaId, categorias)
            };
        });
        const compras = [];
        const compraId2 = [];
        productos.forEach((producto) => {
            const existe = compraId2.some((compra) => {
                return compra.id === producto.compraId;
            });
            if (!existe) {
                compraId2.push({
                    id: producto.compraId,
                    fecha: producto.fecha,
                    costeTotal: producto.costeTotal
                });
            }
        });
        compraId2.forEach((compra) => {
            const productosDeCompra = productos.filter((producto) => producto.compraId === compra.id);
            const comercioId = productosDeCompra[0].comercioId;
            const comercio = comercios[comercioId];
            compras.push({
                comercio,
                costeTotal: compra.costeTotal,
                fecha: compra.fecha,
                productos: productosDeCompra
            });
        });
        return compras;
    }
    setCategoria(categoriaId, categorias) {
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
    async getCompraById(compraId) {
        const res = await this.compraRepository.getCompraById(compraId);
        const categorias = await this.compraRepository.getCategorias();
        const comercios = await this.compraRepository.getComercios();
        const productos = res.rows.map((producto) => {
            return {
                id: producto.productoId,
                compraId: producto.compraId,
                comercioId: producto.comercioId,
                nombre: producto.nombre,
                precio: producto.precio,
                categoria: this.setCategoria(producto.categoriaId, categorias)
            };
        });
        const compras = [];
        const comprasId = [
            ...new Set(productos.map((producto) => {
                const compra = {
                    compraId: producto.compraId,
                    costeTotal: producto.costeTotal
                };
                return compra;
            }))
        ];
        comprasId.forEach((compra) => {
            const productosDeCompra = productos.filter((producto) => producto.compraId === compra.compraId);
            const comercioId = productosDeCompra[0].comercioId;
            const comercio = comercios[comercioId];
            compras.push({
                comercio,
                costeTotal: compra.costeTotal,
                fecha: new Date(),
                productos: productosDeCompra
            });
        });
        return compras;
    }
    async getCompraByUserId(userId) {
        return [];
    }
}
exports.ComprasCases = ComprasCases;
