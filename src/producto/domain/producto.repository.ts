import { type ProductoEntity } from './producto.entity'

export interface ProductoRepository {
  createProducto: (producto: ProductoEntity) => Promise<void>
  buscarProductos: (p: string, c: string, filtro: string, parametro: string) => Promise<any[]>
  getProductoById: (id: string) => Promise<ProductoEntity | null>
  _getCategorias: () => Promise<Record<string, string>>
  updateProducto: (producto: ProductoEntity) => Promise<any>
  deleteProducto: (id: string) => Promise<any>
}
