import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
describe('Search Stores (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to search stores by name', async () => {
    const { accessToken } = await createAndAuthenticateUser(app, true)
    await request(app.server)
      .post('/stores')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'JavaScript Gym',
        slug: 'Some description.',
        latitude: -27.2092052,
        longitude: -49.6401091,
        address: {
          city: 'Campos Belos',
          state: 'Goiás',
          postalCode: '73840-000',
          street: 'Rua 5, qd. 6, lt. 1',
        },
      })
    await request(app.server)
      .post('/stores')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'TypeScript Gym',
        slug: 'Some description.',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
    const response = await request(app.server)
      .get('/stores/search')
      .query({
        name: 'JavaScript',
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    expect(response.statusCode).toEqual(200)
    expect(response.body.stores).toHaveLength(1)
    expect(response.body.stores).toEqual([
      expect.objectContaining({
        name: 'JavaScript Gym',
      }),
    ])
  })
})
