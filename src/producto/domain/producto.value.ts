import {
  type CategoriaProductoEntity,
  type ProductoEntity
} from './producto.entity'

export class Producto implements ProductoEntity {
  public readonly id: string
  public readonly nombre: string
  public readonly precio: number
  public readonly comercioId: string
  public readonly categoria?: CategoriaProductoEntity[]

  constructor(
    id: string,
    nombre: string,
    precio: number,
    comercioId: string,
    categoria?: CategoriaProductoEntity
  ) {
    this.id = id
    this.nombre = nombre
    this.precio = precio
    this.comercioId = comercioId
    this.categoria = categoria ? [categoria] : []
  }
}
export class CategoriaProducto implements CategoriaProductoEntity {
  public readonly id: string
  public readonly nombre?: string

  constructor(id: string, nombre?: string) {
    this.id = id
    this.nombre = nombre
  }
}
