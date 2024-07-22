import { type ProductoEntity } from 'src/producto/domain/producto.entity'
import { type ProductoRepository } from 'src/producto/domain/producto.repository'
import { tursoClient } from '../../../services/db/turso'

export class ProductoSQL implements ProductoRepository {
  public async createProducto(producto: ProductoEntity): Promise<any> {}

  public async buscarProductos(
    p: string,
    c: string,
    filtro: string,
    parametro: string
  ): Promise<any> {
    const offset = parseInt(c, 10)
    const pagina = parseInt(p, 10)
    const calcularPagina = offset * pagina
    try {
      let query = 'SELECT * FROM productos '
      if (filtro !== '' && parametro !== '') {
        query += this._constrirClausulaWhere(filtro, parametro)
      }
      query += ' LIMIT :offset OFFSET :calcularPagina'
      const productos = await tursoClient.execute({
        sql: query,
        args: {
          offset,
          calcularPagina
        }
      })
      return productos.rows
    } catch (error) {
      console.error('Error al buscar productos:', error)
      throw new Error('Error al realizar la búsqueda de productos')
    }
  }

  private _constrirClausulaWhere(filtros: string, parametro: string): string {
    if (filtros === '' || parametro === '') {
      return ' '
    }
    let clausulaWhere = 'WHERE 1=1 ' // Preparar el parámetro para búsquedas LIKE
    const listaFiltros = filtros.split(';')
    const listaParametros = parametro.split(';')
    if (listaFiltros.length !== listaParametros.length) {
      throw new Error('Los filtros y parámetros no coinciden')
    }
    listaFiltros.forEach((filtro, index) => {
      console.log('Filtro:', filtro)
      switch (filtro) {
        case 'nombre':
          // Añadir lógica específica para el filtro por nombre, si es necesario
          clausulaWhere += `AND nombre LIKE UPPER("%${listaParametros[index]}%") `
          break
        case 'precioMayor':
          // Añadir lógica específica para el filtro por precio, si es necesario
          clausulaWhere += `AND precio > ${listaParametros[index]} `
          break
        case 'precioMenor':
          // Añadir lógica específica para el filtro por precio, si es necesario
          clausulaWhere += `AND precio < ${listaParametros[index]} `
          break
        case 'comercioId':
          // Añadir lógica específica para el filtro por comercioId, si es necesario
          clausulaWhere += `AND comercioId = "${listaParametros[index]}" `
          break
        default:
          // Manejar cualquier otro caso o dejar vacío si no se requiere
          break
      }
    })

    return clausulaWhere
  }

  public async _getCategorias(): Promise<Record<string, string>> {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM categorias_producto',
      args: {}
    })
    const categorias: Record<string, string> = {}
    result.rows.forEach((categoria) => {
      const id = String(categoria.id)
      categorias[id] = String(categoria.nombre)
    })
    return categorias
  }

  public async getProductoById(id: string): Promise<ProductoEntity | null> {
    return null
  }

  public async updateProducto(producto: ProductoEntity): Promise<any> {
    console.log('Producto:', producto)
    const query = `UPDATE productos
                   SET nombre = ?, precio = ?, categoriaId = ?
                   WHERE id = ?;`

    let categoriaId
    producto.categoria !== undefined
      ? (categoriaId = producto.categoria
          .map((categoria) => categoria.id)
          .join(','))
      : (categoriaId = '')
    try {
      const result = await tursoClient.execute({
        sql: query,
        args: [producto.nombre, producto.precio, categoriaId, producto.id]
      })
      return result
    } catch (error) {
      console.error('Error al actualizar producto:', error)
      throw new Error('Error al actualizar el producto')
    }
  }

  public async deleteProducto(id: string): Promise<any> {
    const query = 'DELETE FROM productos WHERE id = ?'
    try {
      const result = await tursoClient.execute({
        sql: query,
        args: [id]
      })
      if (result.rowsAffected === 0) {
        throw new Error('Producto no encontrado')
      }
      return result
    } catch (error) {
      console.error('Error al eliminar producto:', error)
      throw new Error('Error al eliminar el producto')
    }
  }
}
