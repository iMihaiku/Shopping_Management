/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { LogColor, Server } from '../../services/server.logs'
import { type ProductoRepository } from '../domain/producto.repository'
import { Producto, type CategoriaProducto } from '../domain/producto.value'
import { ProductosOutput } from './DTO/producto.output'

export class ProductoCases {
  constructor(private readonly productoRepository: ProductoRepository) {}

  async updateProducto(productId: string, producto: any, userId: string): Promise<any> {
    const productoInput: Producto = new Producto(
      productId,
      producto.nombre,
      producto.precio,
      producto.comercioId,
      producto.categoria
    )
    let productoActualizado
    try {
      productoActualizado = await this.productoRepository.updateProducto(
        productoInput
      )
    } catch (error) {
      return { message: 'Producto no encontrado' }
    }
    if (productoActualizado.rows.length === 0) {
      return { message: 'Producto no encontrado' }
    }
    Server.log('Producto actualizado: ' + producto.nombre + ' por el usuario: ' + userId, LogColor.Green)
    return { message: 'Producto actualizado', producto }
  }

  async deleteProducto(id: string, userId: string): Promise<any> {
    try {
      await this.productoRepository.deleteProducto(id)
      Server.log('Producto con id: ' + id + ' eliminado por parte del usuario: ' + userId, LogColor.Green)
      return { message: 'Producto eliminado' }
    } catch (error) {
      return { message: 'Producto no encontrado' }
    }
  }

  async createProducto(producto: any): Promise<void> {
    await this.productoRepository.createProducto(producto)
  }

  async buscarProductos(
    p: string,
    c: string,
    filtro: string,
    parametro: string
  ): Promise<any> {
    const productosRS = await this.productoRepository.buscarProductos(
      p,
      c,
      filtro,
      parametro
    )
    const categorias = await this.productoRepository._getCategorias()
    const productosOutput: ProductosOutput[] = productosRS.map((producto) => {
      return new ProductosOutput(
        producto.nombre,
        producto.precio.toString(),
        this._setCategoria(producto.categoriaId, categorias)
      )
    })
    return productosOutput
  }

  private _setCategoria(
    categoriaId: string,
    categorias: Record<string, string>
  ): CategoriaProducto[] {
    const categoria: CategoriaProducto[] = []
    const categoriasArray = categoriaId ? categoriaId.split(',') : []
    if (categoriasArray.length > 0) {
      categoriasArray.forEach((id) => {
        categoria.push({
          id,
          nombre: categorias[id]
        })
      })
    }
    return categoria
  }
}
