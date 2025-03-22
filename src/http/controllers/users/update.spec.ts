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
      .patch(`/users/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        id: user.id,
        // email: 'johndoeUpdate@example.com', ///
        name: 'John Updated',
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
      where: {
        id: user.id,
      },
    })
    //

    console.log('usuário atualizado', user)

    expect(user.name).toBe('John Updated')
    expect(user.phone).toBe('0627654321')
    expect(user.avatar).toBe('updated-avatar.jpg')
  })

  it('Não deve permitir a atualização do email do usuário', async () => {
    const { accessToken } = await createAndAuthenticateUser(app, true)
    // const { accessToken } = await createAndAuthenticateUser(app, true)

    // Cria um usuário e pega o ID dele
    let user = await prisma.user.findFirstOrThrow()

    // Tenta atualizar o e-mail
    const updateResponse = await request(app.server)
      .patch(`/users/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'new.email@example.com',
      })

    // Verifica que a requisição falhou (400 ou 403 dependendo da regra)
    expect(updateResponse.status).toBe(403) // Ou 403 se for restrição de permissão
    expect(updateResponse.body.message).toBe('Email update is not allowed')

    // Confirma que o e-mail no banco não foi alterado
    user = await prisma.user.findUniqueOrThrow({
      where: { id: user.id },
    })
    expect(user.email).not.toBe('new.email@example.com')
  })

  it('Deve retornar 404 se o usuário não for encontrado', async () => {
    const { accessToken } = await createAndAuthenticateUser(app, true)

    const response = await request(app.server)
      .patch('/users/910f11fe-83d2-44bf-b921-b7faa4cd35ee')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Not Found',
      })

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('User not found')
  })
})
