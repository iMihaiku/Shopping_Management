import { type CategoriaProducto } from '../../../producto/domain/producto.value'

export class ProductosOutput {
  constructor(
    public readonly nombre: string,
    public readonly precio: string,
    public readonly categoria: CategoriaProducto[]
  ) {}
}
