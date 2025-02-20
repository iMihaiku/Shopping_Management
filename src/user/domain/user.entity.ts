import { type UserRole } from './user.value'

export interface UserEntity {
  id: string
  username: string
  email: string
  password: string
  role: UserRole
  endpoint?: string
  tokenUsage: number
  tierAccount: string
}
