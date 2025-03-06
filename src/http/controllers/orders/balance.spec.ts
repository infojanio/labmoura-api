import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import { OrderUseCase } from '@/use-cases/order'
import { OrderStatus } from '@prisma/client'
import { InMemoryStoresRepository } from '@/repositories/in-memory/in-memory-stores-repository'
import { InMemoryOrdersRepository } from '@/repositories/in-memory/in-memory-orders-repository'
import { InMemoryOrderItemsRepository } from '@/repositories/in-memory/in-memory-order-items-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryProductsRepository } from '@/repositories/in-memory/in-memory-products-repository'
import { prisma } from '@/lib/prisma'
import { app } from '@/app'

let ordersRepository: InMemoryOrdersRepository
let orderItemsRepository: InMemoryOrderItemsRepository
let storesRepository: InMemoryStoresRepository
let usersRepository: InMemoryUsersRepository
let sut: OrderUseCase

describe('Balance Calculation Use Case', () => {
  beforeAll(async () => {
    ordersRepository = new InMemoryOrdersRepository()
    orderItemsRepository = new InMemoryOrderItemsRepository()
    storesRepository = new InMemoryStoresRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new OrderUseCase(
      ordersRepository,
      new InMemoryProductsRepository(),
      orderItemsRepository,
      storesRepository,
      usersRepository,
    )

    await app.ready()

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
        name: 'subcategoria-01',
        image: null,
        category_id: 'f6d6a0a6-2f1c-486f-88ff-740469735340',
        created_at: new Date(),
      },
    })
    console.log('subcategoria criada:', subcategory)

    // Criando usuários
    // cria o usuário logado
    const user1 = await prisma.user.create({
      data: {
        id: '9f75e18a-c61f-4dff-ae82-f07b799679b6',
        name: 'John Doe',
        email: 'johndoe@example2.com',
        passwordHash: '123456',
        phone: '6299775614',
        role: 'USER',
        avatar: 'perfil.png',
        created_at: new Date(),
      },
    })
    //console.log('Usuário1', user1)

    // cria o usuário logado
    await usersRepository.create({
      id: user1.id,
      name: 'John Doe2',
      email: 'johndoe2@example2.com',
      passwordHash: '123456',
      phone: '6299775614',
      role: 'USER',
      avatar: 'perfil.png',
      created_at: new Date(),
    })
    console.log('Usuário1', user1)

    // cria o usuário logado
    const user2 = await prisma.user.create({
      data: {
        id: '9f75e18a-c61f-4dff-ae82-f07b799679b2',
        name: 'John Doe2',
        email: 'johndoe2@example2.com',
        passwordHash: '123456',
        phone: '6299775614',
        role: 'USER',
        avatar: 'perfil.png',
        created_at: new Date(),
      },
    })
    // console.log('Usuário2', user2)

    // cria o usuário logado
    await usersRepository.create({
      id: user2.id,
      name: 'John Doe2',
      email: 'johndoe2@example2.com',
      passwordHash: '123456',
      phone: '6299775614',
      role: 'USER',
      avatar: 'perfil.png',
      created_at: new Date(),
    })
    console.log('Usuário2', user2)

    // 🔹 Criando a loja diretamente no Prisma para evitar erro de chave estrangeira
    const store = await prisma.store.create({
      data: {
        id: 'f6d6a0a6-2f1c-486f-88ff-740469735339',
        name: 'Loja Teste',
        slug: 'foto.png',
        latitude: -23.55052,
        longitude: -46.633308,
        created_at: new Date(),
      },
    })
    console.log('Store criada:', store)

    // 🔹 Agora, adicionar a loja ao repositório em memória
    await storesRepository.create({
      id: store.id,
      name: store.name,
      slug: store.slug,
      latitude: store.latitude,
      longitude: store.longitude,
      created_at: store.created_at,
    })
    console.log('Store adicionada ao repositório em memória:', store)

    // Criando produtos vinculados à loja
    const products = [
      {
        id: '9b27542d-f4ea-4cdd-8a85-f718eddf3b1b',
        name: 'Tênis Nike',
        description: 'Masculino, n.40',
        price: 250,
        quantity: 10,
        image: 'foto.jpg',
        store_id: 'f6d6a0a6-2f1c-486f-88ff-740469735339',
        subcategory_id: 'f6d6a0a6-2f1c-486f-88ff-740469735338',
        cashbackPercentage: 15,
        status: true,
        created_at: new Date(),
      },
      {
        id: '9b27542d-f4ea-4cdd-8a85-f718eddf3b12',
        name: 'Camiseta Adidas',
        description: 'Tamanho M',
        price: 120,
        quantity: 15,
        image: 'foto.jpg',
        store_id: 'f6d6a0a6-2f1c-486f-88ff-740469735339',
        subcategory_id: 'f6d6a0a6-2f1c-486f-88ff-740469735338',
        cashbackPercentage: 10,
        status: true,
        created_at: new Date(),
      },

      {
        id: '9b27542d-f4ea-4cdd-8a85-f718eddf3b1c',
        name: 'Mochila Puma',
        description: 'Preta, unissex',
        price: 180,
        quantity: 5,
        image: 'foto.jpg',
        store_id: 'f6d6a0a6-2f1c-486f-88ff-740469735339',
        subcategory_id: 'f6d6a0a6-2f1c-486f-88ff-740469735338',
        cashbackPercentage: 12,
        status: true,
        created_at: new Date(),
      },
    ]

    await prisma.product.createMany({ data: products })
    console.log('Produtos criados:', products)
  })

  afterAll(async () => {
    await app.close()
  })

  it('deve calcular corretamente o saldo do usuário', async () => {
    console.log('Criando primeiro pedido...')
    const order1 = await sut.execute({
      user_id: '9f75e18a-c61f-4dff-ae82-f07b799679b6',
      store_id: 'f6d6a0a6-2f1c-486f-88ff-740469735339',
      userLatitude: -23.55052,
      userLongitude: -46.633308,
      validated_at: new Date(),
      created_at: new Date(),
      status: OrderStatus.VALIDATED,

      items: [
        {
          product_id: '9b27542d-f4ea-4cdd-8a85-f718eddf3b1c',
          quantity: 1,
          subtotal: 120,
        },
        {
          product_id: '9b27542d-f4ea-4cdd-8a85-f718eddf3b12',
          quantity: 1,
          subtotal: 180,
        },
      ],
    })
    console.log('Pedido1:', order1)

    console.log('Criando segundo pedido...')
    const order2 = await sut.execute({
      user_id: '9f75e18a-c61f-4dff-ae82-f07b799679b2',
      store_id: 'f6d6a0a6-2f1c-486f-88ff-740469735339',
      userLatitude: -23.55052,
      userLongitude: -46.633308,
      validated_at: new Date(),
      created_at: new Date(),
      status: OrderStatus.VALIDATED,
      items: [
        {
          product_id: '9b27542d-f4ea-4cdd-8a85-f718eddf3b1b',
          quantity: 2,
          subtotal: 500,
        },
      ],
    })
    console.log('Pedido2:', order2)
    console.log('Calculando saldo do usuário...')
    const balance = await ordersRepository.balanceByUserId(
      '9f75e18a-c61f-4dff-ae82-f07b799679b6',
    )
    console.log('Saldo calculado:', balance)
    expect(balance).toBe(300) // Apenas o segundo pedido pertence ao user-02
  })
})
