import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
describe('Create Store (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to create a store', async () => {
    // 🔹 Criar um usuário ADMIN autenticado para permitir a criação de loja
    const { token } = await createAndAuthenticateUser(app, true) // Passa 'true' para criar um admin
    const response = await request(app.server)
      .post('/stores')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'loja-02',
        slug: 'foto02.jpg',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
    console.log(response.body) // Adiciona um log para ver a resposta do servidor

    // 🔹 Verifica se a resposta foi 201 (Created)
    expect(response.statusCode).toEqual(201)
  })
})
