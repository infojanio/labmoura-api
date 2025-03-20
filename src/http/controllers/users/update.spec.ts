import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Update User (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Deve ser possível atualizar os dados do usuário', async () => {
    // Criação e autenticação de usuário
    const { accessToken } = await createAndAuthenticateUser(app, true)

    // Obtém o usuário criado no banco
    let user = await prisma.user.findFirstOrThrow()

    // Realiza a atualização do usuário
    const updateResponse = await request(app.server)
      .put(`/users/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        id: user.id,
        name: 'John Updated',
        email: 'updated.john@gmail.com',
        phone: '0627654321',
        role: 'ADMIN',
        avatar: 'updated-avatar.jpg',
      })

    console.log(
      '🔵 Update Response:',
      updateResponse.statusCode,
      updateResponse.body,
    )
    expect(updateResponse.statusCode).toBe(204)

    // Verifica se os dados foram realmente atualizados
    user = await prisma.user.findUniqueOrThrow({
      where: { id: user.id },
    })
    console.log('usuário atualizado', user)

    expect(user.name).toBe('John Updated')
    //   expect(user.email).toBe('updated.john@gmail.com')
    expect(user.phone).toBe('0627654321')
    expect(user.avatar).toBe('updated-avatar.jpg')
  })

  it('Deve retornar 404 se o usuário não for encontrado', async () => {
    const { accessToken } = await createAndAuthenticateUser(app, true)

    const response = await request(app.server)
      .put('/users/non-existent-id')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Not Found',
      })

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('User not found')
  })
})
