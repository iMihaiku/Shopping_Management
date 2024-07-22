import { type UserEntity } from './user.entity'

export interface UserRepository {
  createUser: (user: UserEntity) => Promise<void>
  getUserByUsername: (username: string) => Promise<UserEntity | null>
  getUserByUserId: (userId: string) => Promise<UserEntity | null>
}
