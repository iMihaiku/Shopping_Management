/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import tokenValidation from '../../../middleware/user.validate'
import { ProductoSQL } from '../repository/sqlit.repository'
import { ProductoCases } from '../../../producto/application/producto.cases'
import { ProductoController } from '../controller/producto.controller'

const productoRouter = Router()

const productoRepo = new ProductoSQL()
const productoCases = new ProductoCases(productoRepo)
const productoController = new ProductoController(productoCases)

productoRouter.get('/:productoId', tokenValidation, productoController.buscarProductos)
productoRouter.put('/:productId', tokenValidation, productoController.updateProducto)
productoRouter.delete('/:productoId', tokenValidation, productoController.deleteProducto)

export default productoRouter
