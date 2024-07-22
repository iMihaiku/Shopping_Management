"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompraController = void 0;
const compra_value_1 = require("../../../compra/domain/compra.value");
const nanoid_1 = require("nanoid");
const server_logs_1 = require("../../../services/server.logs");
class CompraController {
    compraCases;
    constructor(compraCases) {
        this.compraCases = compraCases;
        this.createCompra = this.createCompra.bind(this);
        this.getComprasByUserId = this.getComprasByUserId.bind(this);
        this.mapearFactura = this.mapearFactura.bind(this);
        this.getCompraById = this.getCompraById.bind(this);
        this.getCompraByUserId = this.getCompraByUserId.bind(this);
    }
    async createCompra(req, res) {
        const compras = req.body;
        const { userId } = req.authInfo;
        const id = (0, nanoid_1.nanoid)(10);
        const productosMapeados = compras.productos.map((producto) => {
            return {
                id: (0, nanoid_1.nanoid)(10),
                nombre: producto.nombre,
                precio: producto.precio,
                comercioId: compras.comercioId,
                categoria: producto.categoria
            };
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const compra = new compra_value_1.Compra(id, userId, new Date(), compras.comercioId, compras.costeTotal, productosMapeados);
        try {
            await this.compraCases.createCompra(compra);
            server_logs_1.Server.log('Se ha creado una nueva compra por parte del usuario: ' + compra.userId, server_logs_1.LogColor.Green);
        }
        catch (error) {
            server_logs_1.Server.log('Error al crear la compra', server_logs_1.LogColor.Red);
            res.status(500).json({ message: 'Error al crear la compra', error });
            return;
        }
        res.status(201).json({ message: 'Compra creada' });
    }
    async getComprasByUserId(req, res) {
        const { filtro = '', parametro = '' } = req.query;
        const { userId } = req.params;
        const result = await this.compraCases.getComprasByUserId(userId, filtro, parametro);
        res.status(200).json({ message: result });
    }
    async mapearFactura(req, res) {
        const factura = req.file;
        if (!factura) {
            res.status(400).json({
                message: 'Debes enviar una factura compatible con nuestros sistemas'
            });
            return;
        }
        if (!req.authInfo.userId) {
            res
                .status(401)
                .json({ message: 'No tienes permisos para realizar esta acción' });
            return;
        }
        const usuario = await this.compraCases.getUsuarioById(req.authInfo.userId);
        console.log(usuario);
        /* let productosRecuperados
        if (req.body.type === 'receipt') {
          productosRecuperados = await mapearReceipt(
            factura.buffer,
            factura.originalname
          )
        } else {
          productosRecuperados = await mapearInvoice(
            factura.buffer,
            factura.originalname
          )
        }
        const productosMapeados = productosRecuperados.map((producto: any) => {
          return {
            nombre: producto.description,
            precio: producto.totalAmount,
            categoria: []
          }
        }) */
        res
            .status(201)
            .json({ message: 'Factura mapeada', productos: 'productosMapeados' });
    }
    async getCompraById(req, res) {
        const { compraId } = req.params;
        const result = await this.compraCases.getCompraById(compraId);
        res.status(200).json({ message: result });
    }
    async getCompraByUserId(req, res) {
        res.status(200).json({ message: 'EndPoint no implementado aun' });
    }
}
exports.CompraController = CompraController;
