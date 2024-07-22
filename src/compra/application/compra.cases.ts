/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/member-delimiter-style */
import { type CompraEntity } from '../domain/compra.entity'
import { type CompraRepository } from '../domain/compra.repository'
import { type CompraOutput } from './DTO/compra.output'
import { type CategoriaProducto } from 'src/producto/domain/producto.value'

export class ComprasCases {
  constructor(private readonly compraRepository: CompraRepository) {}

  async createCompra(compra: CompraEntity): Promise<void> {
    await this.compraRepository.createCompra(compra)
  }

  async mapearFactura(factura: Express.Multer.File): Promise<void> {
    await this.compraRepository.mapearFactura(factura)
  }

  async getUsuarioById(userId: string): Promise<any> {
    const result = await this.compraRepository.getUsuarioById(userId)
    if (result.rows.length === 0) {
      throw new Error('Usuario no encontrado')
    }
    return {
      endpoint: result.rows[0].endpoint,
      tokenUsage: result.rows[0].tokenUsage
    }
  }

  async getComprasByUserId(
    userId: string,
    filtro: string,
    parametro: string
  ): Promise<any> {
    const res = await this.compraRepository.getComprasByUserId(
      userId,
      filtro,
      parametro
    )
    const categorias = await this.compraRepository.getCategorias()
    const comercios = await this.compraRepository.getComercios()
    const productos = res.rows.map(
      (producto: {
        productoId: string
        compraId: string
        comercioId: string
        nombre: string
        precio: number
        fecha: Date
        costeTotal: number
        categoriaId: string
      }) => {
        return {
          id: producto.productoId,
          compraId: producto.compraId,
          comercioId: producto.comercioId,
          nombre: producto.nombre,
          precio: producto.precio,
          fecha: new Date(producto.fecha),
          costeTotal: producto.costeTotal,
          categoria: this.setCategoria(producto.categoriaId, categorias)
        }
      }
    )
    const compras: CompraOutput[] = []
    const compraId2: CompraFormat[] = []
    productos.forEach((producto: any) => {
      const existe = compraId2.some((compra: any) => {
        return compra.id === producto.compraId
      })
      if (!existe) {
        compraId2.push({
          id: producto.compraId,
          fecha: producto.fecha,
          costeTotal: producto.costeTotal
        })
      }
    })
    compraId2.forEach((compra) => {
      const productosDeCompra = productos.filter(
        (producto: any) => producto.compraId === compra.id
      )
      const comercioId = productosDeCompra[0].comercioId
      const comercio = comercios[comercioId]
      compras.push({
        comercio,
        costeTotal: compra.costeTotal,
        fecha: compra.fecha,
        productos: productosDeCompra
      })
    })
    return compras
  }

  private setCategoria(
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

  async getCompraById(compraId: string): Promise<any> {
    const res = await this.compraRepository.getCompraById(compraId)
    const categorias = await this.compraRepository.getCategorias()
    const comercios = await this.compraRepository.getComercios()
    const productos = res.rows.map(
      (producto: {
        productoId: string
        compraId: string
        comercioId: string
        nombre: string
        precio: number
        categoriaId: string
      }) => {
        return {
          id: producto.productoId,
          compraId: producto.compraId,
          comercioId: producto.comercioId,
          nombre: producto.nombre,
          precio: producto.precio,
          categoria: this.setCategoria(producto.categoriaId, categorias)
        }
      }
    )
    const compras: CompraOutput[] = []
    const comprasId: Array<{ compraId: string; costeTotal: number }> = [
      ...(new Set(
        productos.map((producto: any) => {
          const compra: { compraId: string; costeTotal: number } = {
            compraId: producto.compraId,
            costeTotal: producto.costeTotal
          }
          return compra
        })
      ) as unknown as Array<{ compraId: string; costeTotal: number }>)
    ]
    comprasId.forEach((compra) => {
      const productosDeCompra = productos.filter(
        (producto: any) => producto.compraId === compra.compraId
      )
      const comercioId = productosDeCompra[0].comercioId
      const comercio = comercios[comercioId]
      compras.push({
        comercio,
        costeTotal: compra.costeTotal,
        fecha: new Date(),
        productos: productosDeCompra
      })
    })
    return compras
  }

  public async getCompraByUserId(userId: string): Promise<any> {
    return []
  }

  public async gastarTokens(tokensUsados: number, userId: string): Promise<void> {
    await this.compraRepository.gastarTokens(tokensUsados, userId)
  }
}

interface CompraFormat {
  id: string
  fecha: Date
  costeTotal: number
}
