import { createClient } from '@libsql/client'

export const tursoClient = createClient({
  url: process.env.TURSO_URL ?? 'URL No Establecida',
  authToken: process.env.TURSO_AUTH_TOKEN
})
