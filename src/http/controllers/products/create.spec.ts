import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { InMemoryStoresRepository } from '@/repositories/in-memory/in-memory-stores-repository'
import { InMemorySubCategoriesRepository } from '@/repositories/in-memory/in-memory-subcategories-repository'
import { randomUUID } from 'crypto'

let storesRepository: InMemoryStoresRepository
let subcategoriesRepository: InMemorySubCategoriesRepository

let storeId: string
let subcategoryId: string

describe('Create Product (e2e)', () => {
  storesRepository = new InMemoryStoresRepository()
  subcategoriesRepository = new InMemorySubCategoriesRepository()

  beforeAll(async () => {
    await app.ready()
    // Criar uma loja fictícia para vincular ao produto
    const store = await storesRepository.create({
      id: 'loja-01',
      name: 'Loja Teste',
      slug: 'foto.jpg',
      latitude: -23.55052,
      longitude: -46.633308,
    })
    console.log('Loja do cadastro:', store)
    storeId = store.id
    console.log('A', storeId)

    // Criar uma subcategoria fictícia
    const subcategory = await subcategoriesRepository.create({
      id: 'subcategory-01',
      name: 'Subcategoria Teste',
      image: 'tenis.jpg',
      category_id: '11555212122',
      created_at: new Date(),
    })
    console.log('Loja do cadastro:', subcategory)
    subcategoryId = subcategory.id
    console.log('A', subcategoryId)
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to create a product', async () => {
    // 🔹 Criar um usuário ADMIN autenticado para permitir a criação de loja
    const { accessToken } = await createAndAuthenticateUser(app, true) // Passa 'true' para criar um admin

    const response = await request(app.server)
      .post(`/stores/${storeId}/subcategories/${subcategoryId}/products`) // 🔹 Inclua storeId e subcategoryId na URL
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Tênis nike',
        description: 'Masculino, n.40',
        price: 250,
        quantity: 10,
        image: 'foto.jpg',
        cashbackPercentage: 15,
        status: true,
        created_at: new Date(),
      })
    console.log(response.body) // Adiciona um log para ver a resposta do servidor

    // 🔹 Verifica se a resposta foi 201 (Created)
    expect(response.statusCode).toEqual(201)
  })
})
