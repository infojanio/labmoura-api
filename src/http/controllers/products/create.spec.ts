import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { InMemoryStoresRepository } from '@/repositories/in-memory/in-memory-stores-repository'
import { prisma } from '@/lib/prisma'

let storesRepository: InMemoryStoresRepository

describe('Create Product (e2e)', () => {
  beforeAll(async () => {
    storesRepository = new InMemoryStoresRepository()

    await app.ready()
    //cadastrar loja
    const store = await prisma.store.create({
      data: {
        id: 'f6d6a0a6-2f1c-486f-88ff-740469735339',
        name: 'Loja Teste',
        slug: 'foto.png',
        latitude: -23.55052,
        longitude: -46.633308,
      },
    })
    console.log('Store criada:', store)

    //cadastrar subcategoria
    const category = await prisma.category.create({
      data: {
        id: 'f6d6a0a6-2f1c-486f-88ff-740469735340',
        name: 'categoria-01',
        image: null,
        created_at: new Date(),
      },
    })
    console.log('Categoria criada:', category)

    //cadastrar subcategoria
    const subcategory = await prisma.subCategory.create({
      data: {
        id: 'f6d6a0a6-2f1c-486f-88ff-740469735338',
        name: 'loja-01',
        image: null,
        category_id: 'f6d6a0a6-2f1c-486f-88ff-740469735340',
        created_at: new Date(),
      },
    })
    console.log('subcategoria criada:', subcategory)
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to create a product', async () => {
    // 🔹 Criar um usuário ADMIN autenticado para permitir a criação de loja
    const { accessToken } = await createAndAuthenticateUser(app, true) // Passa 'true' para criar um admin

    const response = await request(app.server)
      .post('/products') // 🚀 Nova URL sem storeId e subcategoryId na rota
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        id: 'f6d6a0a6-2f1c-486f-88ff-740469735333',
        store_id: 'f6d6a0a6-2f1c-486f-88ff-740469735339', // Agora enviados no corpo
        subcategory_id: 'f6d6a0a6-2f1c-486f-88ff-740469735338',
        name: 'Tênis nike',
        description: 'Masculino, n.40',
        price: 250,
        quantity: 10,
        image: 'foto.jpg',
        cashbackPercentage: 15,
        status: true,
        created_at: new Date(),
      })

    console.log('Produto->', response.body)
    expect(response.statusCode).toEqual(201)
  })
})
