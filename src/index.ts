/* eslint-disable @typescript-eslint/no-unused-vars */
import { Compra } from './compra/domain/compra.value'
import compraRouter from './compra/infrastructure/routes/compra.router'
import { Producto } from './producto/domain/producto.value'
import productoRouter from './producto/infrastructure/routes/producto.route'
import { Server } from './services/server.logs'
import userRouter from './user/infrastructure/routes/user.router'
import express from 'express'
import * as mindee from 'mindee'

const app = express()
const port = 3000

app.use(express.json())

app.use('/users', userRouter)
app.use('/compras', compraRouter)
app.use('/productos', productoRouter)

app.listen(port, () => {
  Server.log(`Server on ==> http://localhost:${port}`)
})
