/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { UserCases } from '../../application/user.cases'
import { UserController } from '../controller/user.controller'
import { SQLRepository } from '../repository/sql.repository'
import tokenValidation from '../../../middleware/user.validate'
import authValidation from '../../../middleware/user.auth'

const userRouter = Router()

const userRepo = new SQLRepository()
const userCases = new UserCases(userRepo)
const userController = new UserController(userCases)

userRouter.post('/register', userController.registerUser)
userRouter.post('/login', userController.loginUser)
userRouter.get('/:userId', tokenValidation, authValidation, userController.getUserByUserId)

export default userRouter
