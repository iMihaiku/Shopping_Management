import { type ProductosDTO } from './productos.map'

export class CompraInput {
  constructor(
    public readonly comercioId: string,
    public readonly costeTotal: number,
    public readonly productos: ProductosDTO[]
  ) {}
}
