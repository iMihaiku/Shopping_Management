import { type Producto } from 'src/producto/domain/producto.value'

export interface CompraEntity {
  id: string
  userId: string
  fecha: Date
  comercioId: string
  costeTotal: number
  productos: Producto[]
}
