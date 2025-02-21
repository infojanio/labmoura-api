import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('To do Balance (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
    console.log('Server is ready for testing!')
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await prisma.order.deleteMany() // Limpa os pedidos antes de cada teste
    await prisma.store.deleteMany() // Limpa as lojas para evitar conflitos
  })

  it('should be able to do an balance', async () => {
    const { token } = await createAndAuthenticateUser(app, true) //USER->FALSE

    const store = await prisma.store.create({
      data: {
        name: 'Loja Teste',
        slug: 'loja-teste',
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    })

    console.log('Store ID:', store.id) // Debug para verificar se a loja foi criada corretamente

    const response = await request(app.server)
      .post(`/stores/${store.id}/orders`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -27.2092052,
        longitude: -49.6401091,
        total: 150.5, // Supondo que seja necessário um total
        items: [
          { productId: 'prod-1', quantity: 2 },
          { productId: 'prod-2', quantity: 1 },
        ],
      })

    console.log('Order Response:', response.body) // Verificar resposta da API

    expect(response.statusCode).toEqual(201)
  })
})
