import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin: boolean = false,
) {
  const uniqueEmail = `user+${Date.now()}@example.com`

  const user = await prisma.user.create({
    data: {
      name: 'John Doe Origin',
      email: uniqueEmail,
      passwordHash: await hash('123456', 6),
      phone: '62999115514',
      avatar: 'perfil',
      role: isAdmin ? 'ADMIN' : 'USER',
    },
  })
  console.log('Usuário criado:', user)

  const authResponse = await request(app.server).post('/sessions').send({
    email: uniqueEmail,
    password: '123456',
  })

  const { accessToken } = authResponse.body
  // console.log('Token Gerado:', authResponse.body)
  //console.log('Token Aqui:', accessToken)
  return {
    accessToken,
    user,
  }
}
