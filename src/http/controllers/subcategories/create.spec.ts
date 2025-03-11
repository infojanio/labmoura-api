import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'
describe('Create Subcategory (e2e)', () => {
  beforeAll(async () => {
    await app.ready()

    //cadastrar subcategoria
    await prisma.category.create({
      data: {
        id: 'f6d6a0a6-2f1c-486f-88ff-740469735340',
        name: 'categoria-01',
        image: null,
        // created_at: new Date(),
      },
    })
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to create a subcategory', async () => {
    // 🔹 Criar um usuário ADMIN autenticado para permitir a criação de subcategoria
    const { accessToken } = await createAndAuthenticateUser(app, true) // Passa 'true' para criar um admin
    const response = await request(app.server)
      .post('/subcategories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'subcategory-01',
        image: 'foto02.jpg',
        category_id: 'f6d6a0a6-2f1c-486f-88ff-740469735340',
      })
    console.log(response.body) // Adiciona um log para ver a resposta do servidor

    // 🔹 Verifica se a resposta foi 201 (Created)
    expect(response.statusCode).toEqual(201)
  })
})
