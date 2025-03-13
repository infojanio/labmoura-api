import { describe, expect, it, beforeEach, afterAll, beforeAll } from 'vitest'
import request from 'supertest'

import { OrderUseCase } from '@/use-cases/order'
import { OrderStatus } from '@prisma/client'

import { InMemoryStoresRepository } from '@/repositories/in-memory/in-memory-stores-repository'
import { InMemoryOrderItemsRepository } from '@/repositories/in-memory/in-memory-order-items-repository'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { InMemoryOrdersRepository } from '@/repositories/in-memory/in-memory-orders-repository'

let orderItemsRepository: InMemoryOrderItemsRepository
let storesRepository: InMemoryStoresRepository
let sut: OrderUseCase

describe('Create Order Use Case', () => {
  beforeAll(async () => {
    storesRepository = new InMemoryStoresRepository()
    orderItemsRepository = new InMemoryOrderItemsRepository(
      new InMemoryOrdersRepository(),
    )

    await app.ready()

    // cria o usuário logado
    const user = await prisma.user.create({
      data: {
        id: '9f75e18a-c61f-4dff-ae82-f07b799679b6',
        name: 'John Doe',
        email: 'johndoe@example2.com',
        passwordHash: '123456',
        phone: '6299775614',
        role: 'USER',
        avatar: 'perfil.png',
      },
    })
    console.log('Usuário', user)

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

    const product1 = await prisma.product.create({
      data: {
        id: '9b27542d-f4ea-4cdd-8a85-f718eddf3b1b',
        name: 'Tênis nike',
        description: 'Masculino, n.40',
        price: 250,
        quantity: 10,
        image: 'foto.jpg',
        store_id: 'f6d6a0a6-2f1c-486f-88ff-740469735339', // Agora enviados no corpo
        subcategory_id: 'f6d6a0a6-2f1c-486f-88ff-740469735338',
        cashbackPercentage: 15,
        status: true,
        created_at: new Date(),
      },
    })
    console.log('Produto1 do pedido criado:', product1)

    const product2 = await prisma.product.create({
      data: {
        id: '9b27542d-f4ea-4cdd-8a85-f718eddf3b1c',
        name: 'Tênis nike',
        description: 'Masculino, n.40',
        price: 250,
        quantity: 10,
        image: 'foto.jpg',
        store_id: 'f6d6a0a6-2f1c-486f-88ff-740469735339', // Agora enviados no corpo
        subcategory_id: 'f6d6a0a6-2f1c-486f-88ff-740469735338',
        cashbackPercentage: 15,
        status: true,
        created_at: new Date(),
      },
    })
    console.log('Produto2 do pedido criado:', product2)
  })
  afterAll(async () => {
    await app.close()
  })

  it('deve criar um pedido com itens', async () => {
    // 🔹 Criar um usuário ADMIN autenticado para permitir a criação de loja
    const { accessToken } = await createAndAuthenticateUser(app, true) // Passa 'true' para criar um admin

    const items = [
      {
        product_id: '9b27542d-f4ea-4cdd-8a85-f718eddf3b1b',
        quantity: 1,
        subtotal: 1,
      },
      {
        product_id: '9b27542d-f4ea-4cdd-8a85-f718eddf3b1c',
        quantity: 1,
        subtotal: 1,
      },
    ]

    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0)

    const response = await request(app.server)
      .post('/orders') // 🚀 Nova URL sem storeId e subcategoryId na rota
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        user_id: '9f75e18a-c61f-4dff-ae82-f07b799679b6',
        store_id: 'f6d6a0a6-2f1c-486f-88ff-740469735339',
        latitude: -23.55052,
        longitude: -46.633308,
        totalAmount,
        validated_at: null,
        created_at: new Date(),
        status: OrderStatus.PENDING,
        items: [
          {
            product_id: '9b27542d-f4ea-4cdd-8a85-f718eddf3b1b',
            quantity: 2,
            subtotal: 60,
          },
          {
            product_id: '9b27542d-f4ea-4cdd-8a85-f718eddf3b1c',
            quantity: 1,
            subtotal: 30,
          },
        ],
      })

    console.log('Pedido->', response.body)
    expect(response.statusCode).toEqual(201)
  })
})
