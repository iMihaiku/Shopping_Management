"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductoSQL = void 0;
const turso_1 = require("../../../services/db/turso");
class ProductoSQL {
    async createProducto(producto) { }
    async buscarProductos(p, c, filtro, parametro) {
        const offset = parseInt(c, 10);
        const pagina = parseInt(p, 10);
        const calcularPagina = offset * pagina;
        try {
            let query = 'SELECT * FROM productos ';
            if (filtro !== '' && parametro !== '') {
                query += this._constrirClausulaWhere(filtro, parametro);
            }
            query += ' LIMIT :offset OFFSET :calcularPagina';
            const productos = await turso_1.tursoClient.execute({
                sql: query,
                args: {
                    offset,
                    calcularPagina
                }
            });
            return productos.rows;
        }
        catch (error) {
            console.error('Error al buscar productos:', error);
            throw new Error('Error al realizar la búsqueda de productos');
        }
    }
    _constrirClausulaWhere(filtros, parametro) {
        if (filtros === '' || parametro === '') {
            return ' ';
        }
        let clausulaWhere = 'WHERE 1=1 '; // Preparar el parámetro para búsquedas LIKE
        const listaFiltros = filtros.split(';');
        const listaParametros = parametro.split(';');
        if (listaFiltros.length !== listaParametros.length) {
            throw new Error('Los filtros y parámetros no coinciden');
        }
        listaFiltros.forEach((filtro, index) => {
            console.log('Filtro:', filtro);
            switch (filtro) {
                case 'nombre':
                    // Añadir lógica específica para el filtro por nombre, si es necesario
                    clausulaWhere += `AND nombre LIKE UPPER("%${listaParametros[index]}%") `;
                    break;
                case 'precioMayor':
                    // Añadir lógica específica para el filtro por precio, si es necesario
                    clausulaWhere += `AND precio > ${listaParametros[index]} `;
                    break;
                case 'precioMenor':
                    // Añadir lógica específica para el filtro por precio, si es necesario
                    clausulaWhere += `AND precio < ${listaParametros[index]} `;
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
    async _getCategorias() {
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
    async getProductoById(id) {
        return null;
    }
    async updateProducto(producto) {
        console.log('Producto:', producto);
        const query = `UPDATE productos
                   SET nombre = ?, precio = ?, categoriaId = ?
                   WHERE id = ?;`;
        let categoriaId;
        producto.categoria !== undefined
            ? (categoriaId = producto.categoria
                .map((categoria) => categoria.id)
                .join(','))
            : (categoriaId = '');
        try {
            const result = await turso_1.tursoClient.execute({
                sql: query,
                args: [producto.nombre, producto.precio, categoriaId, producto.id]
            });
            return result;
        }
        catch (error) {
            console.error('Error al actualizar producto:', error);
            throw new Error('Error al actualizar el producto');
        }
    }
    async deleteProducto(id) {
        const query = 'DELETE FROM productos WHERE id = ?';
        try {
            const result = await turso_1.tursoClient.execute({
                sql: query,
                args: [id]
            });
            if (result.rowsAffected === 0) {
                throw new Error('Producto no encontrado');
            }
            return result;
        }
        catch (error) {
            console.error('Error al eliminar producto:', error);
            throw new Error('Error al eliminar el producto');
        }
    }
}
exports.ProductoSQL = ProductoSQL;
