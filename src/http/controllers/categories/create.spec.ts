import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
describe('Create Category (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to create a category', async () => {
    // 🔹 Criar um usuário ADMIN autenticado para permitir a criação de subcategoria
    const { accessToken } = await createAndAuthenticateUser(app, true) // Passa 'true' para criar um admin
    const response = await request(app.server)
      .post('/categories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'category-01',
        image: 'foto02.jpg',
        //  created_at: new Date(), foi fornecido automaticamente no create
      })
    console.log(response.body) // Adiciona um log para ver a resposta do servidor

    // 🔹 Verifica se a resposta foi 201 (Created)
    expect(response.statusCode).toEqual(201)
  })
})
