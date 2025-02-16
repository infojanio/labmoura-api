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
    const { token } = await createAndAuthenticateUser(app, true)
    await request(app.server)
      .post('/stores')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'JavaScript Gym',
        slug: 'Some description.',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
    await request(app.server)
      .post('/stores')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'TypeScript Gym',
        slug: 'Some description.',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
    const response = await request(app.server)
      .get('/stores/search')
      .query({
        q: 'JavaScript',
      })
      .set('Authorization', `Bearer ${token}`)
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
