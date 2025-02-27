import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
describe('Create Product (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to create a product', async () => {
    // 🔹 Criar um usuário ADMIN autenticado para permitir a criação de loja
    const { accessToken } = await createAndAuthenticateUser(app, true) // Passa 'true' para criar um admin

    const response = await request(app.server)
      .post('/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Tênis nike',
        description: 'Masculino, n.40',
        price: 250,
        quantity: 10,
        image: 'foto.jpg',
        cashbackPercente: 15,
        storeId: '1112223311',
        subcategoryId: '1133222111',
        status: true,
      })
    console.log(response.body) // Adiciona um log para ver a resposta do servidor

    // 🔹 Verifica se a resposta foi 201 (Created)
    expect(response.statusCode).toEqual(201)
  })
})
