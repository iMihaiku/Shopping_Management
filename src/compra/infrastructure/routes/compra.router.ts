/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { CompraSQL } from '../repository/compra.sql'
import { ComprasCases } from '../../../compra/application/compra.cases'
import { CompraController } from '../controller/compra.controller'
import authValidation from '../../../middleware/user.auth'
import tokenValidation from '../../../middleware/user.validate'
import multer from 'multer'

const upload = multer()

const compraRouter = Router()

const compraRepo = new CompraSQL()
const compraCases = new ComprasCases(compraRepo)
const compraController = new CompraController(compraCases)

compraRouter.post('/crear', tokenValidation, compraController.createCompra)
compraRouter.post('/mapearFactura', tokenValidation, upload.single('factura'), compraController.mapearFactura)
compraRouter.get('/:compraId', tokenValidation, compraController.getCompraById)
compraRouter.get('/:userId', tokenValidation, authValidation, compraController.getCompraByUserId)
compraRouter.get('/todas/:userId', tokenValidation, authValidation, compraController.getComprasByUserId)

export default compraRouter
