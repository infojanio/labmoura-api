import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  console.log('REQUEST BODY:', request.body) // Debug para ver se o body está chegando

  const body = request.body as any
  if (!body || typeof body !== 'object') {
    return reply.status(400).send({ message: 'Invalid request body' })
  }

  const { refreshToken } = body as { refreshToken?: string }

  if (!refreshToken) {
    console.log('Refresh token ausente no corpo da requisição!')
    return reply.status(400).send({ message: 'Refresh token is required' })
  }

  try {
    // 1️⃣ Verifica se o refresh token existe no banco
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    })

    if (!storedToken) {
      return reply.status(401).send({ message: 'Invalid refresh token' })
    }

    // 2️⃣ Verifica se o token é válido
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as {
      sub: string
      role: string
    }

    const { sub: userId, role } = decoded

    // 3️⃣ Gera um novo access token
    const newAccessToken = await reply.jwtSign(
      { role },
      { sign: { sub: userId, expiresIn: '15m' } },
    )

    // 4️⃣ Gera um novo refresh token e salva no banco
    const newRefreshToken = await reply.jwtSign(
      { role },
      { sign: { sub: userId, expiresIn: '7d' } },
    )

    await prisma.refreshToken.create({
      data: {
        userId,
        token: newRefreshToken,
      },
    })

    // 5️⃣ Remove o refresh token antigo do banco
    await prisma.refreshToken.delete({ where: { token: refreshToken } })

    return reply.status(200).send({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
  } catch (error) {
    return reply.status(401).send({ message: 'Invalid refresh token' })
  }
}
