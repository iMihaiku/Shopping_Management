import { type ProductosDTO } from './productos.map'

export class CompraOutput {
  constructor(
    public readonly comercio: string,
    public readonly fecha: Date,
    public readonly costeTotal: number,
    public readonly productos: ProductosDTO[]
  ) {}
}
