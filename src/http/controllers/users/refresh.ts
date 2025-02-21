import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  console.log('🚀 Recebendo requisição de refresh token...')
  console.log('REQUEST BODY:', request.body)

  if (!request.body || typeof request.body !== 'object') {
    console.log('❌ Nenhum corpo de requisição recebido!')
    return reply.status(400).send({ message: 'Invalid request body' })
  }

  const { refreshToken } = request.body as { refreshToken?: string }

  if (!refreshToken) {
    console.log('❌ Refresh token ausente no corpo da requisição!')
    return reply.status(400).send({ message: 'Refresh token is required' })
  }

  // Verifica se o token existe no banco de dados
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  })

  if (!storedToken) {
    console.log('❌ Refresh token inválido!')
    return reply.status(401).send({ message: 'Invalid refresh token' })
  }

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as {
      sub: string
      role: string
    }

    console.log('✅ Token decodificado:', decoded)

    const { sub: userId, role } = decoded

    // Gera um novo access token
    const newAccessToken = await reply.jwtSign(
      { role },
      { sign: { sub: userId, expiresIn: '15m' } },
    )

    // Define uma nova data de expiração (7 dias a partir de agora)
    const newExpiresAt = new Date()
    newExpiresAt.setDate(newExpiresAt.getDate() + 7)

    // Gera um novo refresh token
    const newRefreshToken = await reply.jwtSign(
      { role },
      { sign: { sub: userId, expiresIn: '7d' } },
    )

    // Atualiza o refresh token no banco
    await prisma.refreshToken.update({
      where: { token: refreshToken },
      data: {
        token: newRefreshToken,
        expiresAt: newExpiresAt, // Atualizando a data de expiração
      },
    })

    console.log('✅ Novo refresh token gerado e atualizado no banco!')

    return reply.status(200).send({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
  } catch (error) {
    console.log('❌ Erro ao validar o refresh token:', error)
    return reply.status(401).send({ message: 'Invalid refresh token' })
  }
}
