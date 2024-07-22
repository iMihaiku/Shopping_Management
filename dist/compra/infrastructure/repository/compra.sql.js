"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompraSQL = void 0;
const turso_1 = require("../../../services/db/turso");
class CompraSQL {
    async createCompra(compra) {
        const transaction = await turso_1.tursoClient.transaction('write');
        try {
            await transaction.execute({
                sql: `INSERT INTO 
              compras (id, userId, fecha, comercioId, costeTotal) 
              VALUES (:id, :userId, :fecha, :comercioId, :costeTotal)`,
                args: {
                    id: compra.id,
                    userId: compra.userId,
                    fecha: compra.fecha,
                    costeTotal: compra.costeTotal,
                    comercioId: compra.comercioId
                }
            });
            const statement = compra.productos.map((producto) => {
                let idsDeProductos;
                if (producto.categoria?.length && producto.categoria?.length > 0) {
                    idsDeProductos = producto.categoria
                        .map((categoria) => categoria.id)
                        .join(',');
                }
                return {
                    sql: `INSERT INTO 
            productos (compraId, id, comercioId, precio, nombre, categoriaId) 
            VALUES (:compraId, :productoId, :comercioId, :precio, :nombre, :categoriaId)`,
                    args: {
                        compraId: compra.id,
                        productoId: producto.id,
                        comercioId: producto.comercioId,
                        precio: producto.precio,
                        nombre: producto.nombre,
                        categoriaId: idsDeProductos ?? null
                    }
                };
            });
            await transaction.batch(statement);
            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async getCompraByUserId(userId) { }
    async getUsuarioById(userId) {
        try {
            return await turso_1.tursoClient.execute({
                sql: 'SELECT * FROM users WHERE id = :userId',
                args: { userId }
            });
        }
        catch (error) {
            return error;
        }
    }
    async getComprasByUserId(userId, filtro, parametro) {
        try {
            let query = `SELECT 
                   c.id AS compraId,
                   c.userId,
                   c.fecha,
                   c.comercioId,
                   c.costeTotal,
                   p.id AS productoId,
                   p.nombre,
                   p.precio,
                   p.categoriaId
                  FROM compras c
                  JOIN productos p ON c.id = p.compraId`;
            query += this._constrirClausulaWhere(filtro, parametro);
            const productos = await turso_1.tursoClient.execute({
                sql: query,
                args: { userId }
            });
            return productos;
        }
        catch (error) {
            return error;
        }
    }
    async getComercios() {
        const result = await turso_1.tursoClient.execute({
            sql: 'SELECT * FROM comercios',
            args: {}
        });
        const comercios = {};
        result.rows.forEach((comercio) => {
            const id = String(comercio.id);
            comercios[id] = String(comercio.nombre);
        });
        return comercios;
    }
    async getCompraById(compraId) {
        try {
            const compra = await turso_1.tursoClient.execute({
                sql: `SELECT  
        c.id AS compraId,
        c.userId,
        c.fecha,
        c.comercioId,
        c.costeTotal,
        p.id AS productoId,
        p.nombre,
        p.precio,
        p.categoriaId
      FROM compras c
      JOIN productos p ON c.id = p.compraId
      WHERE c.id = :compraId`,
                args: { compraId }
            });
            return compra;
        }
        catch (error) {
            return error;
        }
    }
    async getProductosByCompraId(compraId) {
        try {
            return await turso_1.tursoClient.execute({
                sql: 'SELECT * FROM productos WHERE compraId = :compraId',
                args: { compraId }
            });
        }
        catch (error) {
            return error;
        }
    }
    async getComercioById(comercioId) {
        try {
            return await turso_1.tursoClient.execute({
                sql: 'SELECT * FROM comercios WHERE id = :comercioId',
                args: { comercioId }
            });
        }
        catch (error) {
            return error;
        }
    }
    async getCategorias() {
        const result = await turso_1.tursoClient.execute({
            sql: 'SELECT * FROM categorias_producto',
            args: {}
        });
        const categorias = {};
        result.rows.forEach((categoria) => {
            const id = String(categoria.id);
            categorias[id] = String(categoria.nombre);
        });
        return categorias;
    }
    async mapearFactura(factura) { }
    _constrirClausulaWhere(filtros, parametro) {
        let clausulaWhere = ' WHERE userId = :userId '; // Preparar el parámetro para búsquedas LIKE
        if (filtros === '' || parametro === '') {
            return clausulaWhere;
        }
        const listaFiltros = filtros.split(';');
        const listaParametros = parametro.split(';');
        let timestamp;
        if (listaFiltros.length !== listaParametros.length) {
            throw new Error('Los filtros y parámetros no coinciden');
        }
        listaFiltros.forEach((filtro, index) => {
            switch (filtro) {
                case 'costeMayor':
                    // Añadir lógica específica para el filtro por precio, si es necesario
                    clausulaWhere += `AND costeTotal > ${listaParametros[index]} `;
                    break;
                case 'costeMenor':
                    // Añadir lógica específica para el filtro por precio, si es necesario
                    clausulaWhere += `AND costeTotal < ${listaParametros[index]} `;
                    break;
                case 'fechaMenor':
                    timestamp = new Date(listaParametros[index]).getTime();
                    clausulaWhere += `AND fecha <= ${timestamp} `;
                    break;
                case 'fechaMayor':
                    timestamp = new Date(listaParametros[index]).getTime();
                    clausulaWhere += `AND fecha >= ${timestamp} `;
                    break;
                case 'comercioId':
                    // Añadir lógica específica para el filtro por comercioId, si es necesario
                    clausulaWhere += `AND comercioId = "${listaParametros[index]}" `;
                    break;
                default:
                    // Manejar cualquier otro caso o dejar vacío si no se requiere
                    break;
            }
        });
        return clausulaWhere;
    }
}
exports.CompraSQL = CompraSQL;
