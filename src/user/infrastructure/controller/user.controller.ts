import { type UserCases } from '../../application/user.cases'
import { type Request, type Response } from 'express'

export class UserController {
  constructor(private readonly userCases: UserCases) {
    this.registerUser = this.registerUser.bind(this)
    this.getUserByUsername = this.getUserByUsername.bind(this)
    this.getUserByUserId = this.getUserByUserId.bind(this)
    this.loginUser = this.loginUser.bind(this)
  }

  public async registerUser(req: Request, res: Response): Promise<void> {
    const { username, email, password } = req.body as {
      username: string
      email: string
      password: string
    }
    try {
      await this.userCases.createUser(username, email, password)
      res.status(201).send(`User ${username} created`)
    } catch (error: any) {
      res.status(400).send(error.message)
    }
  }

  public async getUserByUsername(req: Request, res: Response): Promise<void> {
    const { username } = req.params
    const user = await this.userCases.getUserByUsername(username)
    if (user === null) {
      res.status(404).send('User not found')
      return
    }
    res.status(200).send(user)
  }

  public async getUserByUserId(req: Request, res: Response): Promise<void> {
    const { userId } = req.params
    const user = await this.userCases.getUserByUserId(userId)
    if (user === null) {
      res.status(404).send('Usuario no encontrado')
      return
    }
    res.status(200).send(user)
  }

  public async loginUser(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body as {
      username: string
      password: string
    }
    const user = await this.userCases.loginUser(username, password)
    if (user === null) {
      res.status(401).send('Las credenciales proporcionadas no son validas')
      return
    }
    res.status(200).send(user)
  }
}
