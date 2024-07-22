/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { type ProductoCases } from 'src/producto/application/producto.cases'
import { type Request, type Response } from 'express'

export class ProductoController {
  constructor(private readonly compraCases: ProductoCases) {
    this.buscarProductos = this.buscarProductos.bind(this)
    this.updateProducto = this.updateProducto.bind(this)
    this.deleteProducto = this.deleteProducto.bind(this)
  }

  public async buscarProductos(req: Request, res: Response): Promise<void> {
    const { p = '50', c = '0', filtro = '', parametro = '' } = req.query
    const result = await this.compraCases.buscarProductos(
      p as string,
      c as string,
      filtro as string,
      parametro as string
    )
    res.status(201).json({ productos: result })
  }

  public async updateProducto(req: Request, res: Response): Promise<void> {
    const { producto } = req.body
    const { productId } = req.params
    const mensaje = await this.compraCases.updateProducto(productId, producto, req.authInfo.userId as string)
    res.status(200).json(mensaje)
  }

  public async deleteProducto(req: Request, res: Response): Promise<void> {
    const { productoId } = req.params
    const mensaje = await this.compraCases.deleteProducto(productoId, req.authInfo.userId as string)
    res.status(200).json(mensaje)
  }
}
