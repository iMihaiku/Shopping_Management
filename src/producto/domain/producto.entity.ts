export interface ProductoEntity {
  id: string
  nombre: string
  precio: number
  comercioId: string
  categoria?: CategoriaProductoEntity[]
}
export interface CategoriaProductoEntity {
  id: string
  nombre?: string
}
