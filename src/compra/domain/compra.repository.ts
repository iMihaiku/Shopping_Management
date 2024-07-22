import { type CompraEntity } from './compra.entity'

export interface CompraRepository {
  createCompra: (compra: CompraEntity) => Promise<void>
  mapearFactura: (factura: Express.Multer.File) => Promise<void>
  getComprasByUserId: (
    userId: string,
    filtro: string,
    parametro: string
  ) => Promise<CompraEntity[]> | Promise<any>
  getCompraById: (compraId: string) => Promise<CompraEntity> | Promise<any>
  getProductosByCompraId: (compraId: string) => Promise<any>
  getComercioById: (comercioId: string) => Promise<any>
  getComercios: () => Promise<Record<string, string>>
  getCategorias: () => Promise<Record<string, string>>
  getCompraByUserId: (userId: string) => Promise<any>
  getUsuarioById: (userId: string) => Promise<any>
  gastarTokens: (tokensUsados: number, userId: string) => Promise<void>
}
