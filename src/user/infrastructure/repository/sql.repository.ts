import { type UserEntity } from '../../domain/user.entity'
import { type UserRepository } from '../../domain/user.repository'
import { tursoClient } from '../../../services/db/turso'
import { Server, LogColor } from '../../../services/server.logs'
import { TierAccount, User, type UserRole } from '../../domain/user.value'
import { type ResultSet } from '@libsql/client/.'

export class SQLRepository implements UserRepository {
  public async createUser(user: UserEntity): Promise<void> {
    if (await this.checkUsernameExists(user.username)) {
      throw new Error('Username already exists')
    }
    const nUsuariosActuales = await tursoClient.execute({
      sql: 'SELECT COUNT(*) FROM users',
      args: {}
    })
    if (!nUsuariosActuales.rows[0]?.['COUNT(*)']) {
      throw new Error('Error getting number of users')
    }
    if (nUsuariosActuales.rows[0]['COUNT(*)'] as number >= 25) {
      throw new Error('Max number of users reached')
    }
    await tursoClient.execute({
      sql: `INSERT INTO 
      users (id, username, email, password, role, endpoint, tokenUsage, tierAccount) 
      VALUES (:id, :username, :email, :password, :role, :endpoint, :tokenUsage, :tierAccount)`,
      args: {
        id: user.id,
        username: user.username,
        password: user.password,
        email: user.email,
        role: user.role,
        endpoint: null,
        tokenUsage: 0,
        tierAccount: TierAccount.FREE
      }
    })
    Server.log(
      `User ${user.username} created with id: ${user.id}`,
      LogColor.Green
    )
  }

  public async getUserByUsername(username: string): Promise<UserEntity | null> {
    const resultSet = await this.searchUsername(username)
    if (resultSet.rows.length === 0) return null
    const row = resultSet.rows[0]
    return this.mapUser(row)
  }

  public async getUserByUserId(userId: string): Promise<UserEntity | null> {
    const resultSet = await this.searchUserId(userId)
    if (resultSet.rows.length === 0) return null
    const row = resultSet.rows[0]
    return this.mapUser(row)
  }

  private async searchUsername(username: string): Promise<ResultSet> {
    const resultSet = await tursoClient.execute({
      sql: 'SELECT * FROM users WHERE username = :username',
      args: {
        username
      }
    })
    return resultSet
  }

  private async searchUserId(userId: string): Promise<ResultSet> {
    const resultSet = await tursoClient.execute({
      sql: 'SELECT * FROM users WHERE id = :userId',
      args: {
        userId
      }
    })
    return resultSet
  }

  private async checkUsernameExists(username: string): Promise<boolean> {
    const resultSet = await this.searchUsername(username)
    return resultSet.rows.length > 0
  }

  private mapUser(row: any): UserEntity {
    return new User(
      row.id as string,
      row.username as string,
      row.email as string,
      row.password as string,
      row.role as UserRole,
      row.endpoint as string,
      row.tokenUsage as number,
      row.tierAccount as TierAccount
    )
  }
}
