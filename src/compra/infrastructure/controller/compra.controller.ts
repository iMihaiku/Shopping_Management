import { type ComprasCases } from '../../../compra/application/compra.cases'
import { type Request, type Response } from 'express'
import { Compra } from '../../../compra/domain/compra.value'
// import compraMock from '../../../mock/compra.mock.json'
import {
  mapearReceipt,
  mapearInvoice
} from '../../../services/mindee/mindee.api'
import { nanoid } from 'nanoid'
import { type Producto } from 'src/producto/domain/producto.value'
import { type CompraInput } from 'src/compra/application/DTO/compra.input'
import { LogColor, Server } from '../../../services/server.logs'
import { PDFDocument } from 'pdf-lib'

export class CompraController {
  constructor(private readonly compraCases: ComprasCases) {
    this.createCompra = this.createCompra.bind(this)
    this.getComprasByUserId = this.getComprasByUserId.bind(this)
    this.mapearFactura = this.mapearFactura.bind(this)
    this.getCompraById = this.getCompraById.bind(this)
    this.getCompraByUserId = this.getCompraByUserId.bind(this)
  }

  public async createCompra(req: Request, res: Response): Promise<void> {
    const compras = req.body as CompraInput
    const { userId } = req.authInfo as { userId: string }
    const id = nanoid(10)
    const productosMapeados: Producto[] = compras.productos.map(
      (producto: any) => {
        return {
          id: nanoid(10),
          nombre: producto.nombre,
          precio: producto.precio,
          comercioId: compras.comercioId,
          categoria: producto.categoria
        }
      }
    )
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const compra = new Compra(
      id,
      userId,
      new Date(),
      compras.comercioId,
      compras.costeTotal,
      productosMapeados
    )

    try {
      await this.compraCases.createCompra(compra)
      Server.log(
        'Se ha creado una nueva compra por parte del usuario: ' + compra.userId,
        LogColor.Green
      )
    } catch (error) {
      Server.log('Error al crear la compra', LogColor.Red)
      res.status(500).json({ message: 'Error al crear la compra', error })
      return
    }
    res.status(201).json({ message: 'Compra creada' })
  }

  public async getComprasByUserId(req: Request, res: Response): Promise<void> {
    const { filtro = '', parametro = '' } = req.query
    const { userId } = req.params
    const result = await this.compraCases.getComprasByUserId(
      userId,
      filtro as string,
      parametro as string
    )
    res.status(200).json({ message: result })
  }

  public async mapearFactura(req: Request, res: Response): Promise<void> {
    if (!req.authInfo.userId) {
      res
        .status(401)
        .json({ message: 'No tienes permisos para realizar esta acción' })
      return
    }
    const factura = req.file
    if (!factura) {
      res.status(400).json({
        message: 'Debes enviar una factura compatible con nuestros sistemas'
      })
      return
    }
    const loadPDF = await PDFDocument.load(factura.buffer)
    const nPaginas = loadPDF.getPageCount()
    if (nPaginas > 5) {
      res.status(400).json({
        message: `Los PDF's con más de 5 páginas
         no son compatibles con nuestros sistemas`
      })
      return
    }
    let datosUsuario: {
      endpoint: string
      tokenUsage: number
    }
    try {
      datosUsuario = await this.compraCases.getUsuarioById(
        req.authInfo.userId as string
      )
      console.log('usuario', datosUsuario)
    } catch (error) {
      res.status(404).json({ message: error })
      return
    }
    if (datosUsuario.tokenUsage > 10) {
      res.status(403).json({
        message: 'Has superado el límite de tokens diarios'
      })
      return
    }
    if (datosUsuario.tokenUsage + nPaginas > 10) {
      res.status(403).json({
        message: 'No tienes suficientes tokens para leer este fichero'
      })
      return
    }
    let productosRecuperados
    if (req.body.type === 'receipt') {
      productosRecuperados = await mapearReceipt(
        factura.buffer,
        factura.originalname,
        datosUsuario.endpoint
      )
    } else {
      productosRecuperados = await mapearInvoice(
        factura.buffer,
        factura.originalname,
        datosUsuario.endpoint
      )
    }
    const productosMapeados = productosRecuperados.map((producto: any) => {
      return {
        nombre: producto.description,
        precio: producto.totalAmount,
        categoria: []
      }
    })
    await this.compraCases.gastarTokens(nPaginas, req.authInfo.userId as string)
    res
      .status(201)
      .json({ message: 'Factura mapeada', productos: productosMapeados })
  }

  public async getCompraById(req: Request, res: Response): Promise<void> {
    const { compraId } = req.params
    const result = await this.compraCases.getCompraById(compraId)
    res.status(200).json({ message: result })
  }

  public async getCompraByUserId(req: Request, res: Response): Promise<void> {
    res.status(200).json({ message: 'EndPoint no implementado aun' })
  }
}
