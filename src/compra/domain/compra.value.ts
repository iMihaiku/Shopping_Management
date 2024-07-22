import { type Producto } from 'src/producto/domain/producto.value'
import { type CompraEntity } from './compra.entity'

export class Compra implements CompraEntity {
  public readonly id: string
  public readonly userId: string
  public readonly fecha: Date
  public readonly comercioId: string
  public readonly costeTotal: number
  public readonly productos: Producto[]

  constructor(
    id: string,
    userId: string,
    fecha: Date,
    comercioId: string,
    costeTotal: number,
    productos: Producto[]
  ) {
    this.id = id
    this.userId = userId
    this.fecha = fecha
    this.comercioId = comercioId
    this.costeTotal = costeTotal
    this.productos = productos
  }
}
