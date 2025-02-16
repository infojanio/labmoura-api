import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Balance (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should calculate the correct balance after creating orders', async () => {
    // 🔹 Criamos um usuário autenticado
    const { token } = await createAndAuthenticateUser(app, true)

    // 🔹 Criamos uma loja para associar os pedidos
    const storeResponse = await request(app.server)
      .post('/stores')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Loja Teste',
        slug: 'loja-teste',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    const storeId = storeResponse.body.id

    // 🔹 Criamos dois pedidos para esse usuário
    const order1 = await request(app.server)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        storeId,
        totalAmount: 100,
        created_at: new Date(),
        validated_at: new Date(),
        status: 'CONFIRMED',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      })

    const order2 = await request(app.server)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        storeId,
        totalAmount: 50,
        created_at: new Date(),
        validated_at: new Date(),
        status: 'CONFIRMED',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      })

    expect(order1.statusCode).toEqual(201)
    expect(order2.statusCode).toEqual(201)

    // 🔹 Consultamos o saldo total do usuário
    const balanceResponse = await request(app.server)
      .get('/balance')
      .set('Authorization', `Bearer ${token}`)

    expect(balanceResponse.statusCode).toEqual(200)

    // 🔹 Verificamos se o saldo total está correto (100 + 50 = 150)
    expect(balanceResponse.body.balance).toEqual(150)
  })
})
