import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/utils/messages/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/factories/make-authenticate-use-case'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()
    const { user } = await authenticateUseCase.execute({ email, password })

    // Comparação da senha digitada com o hash do banco de dados
    const passwordMatch = await bcrypt.compare(password, user.passwordHash)
    if (!passwordMatch) {
      return reply.status(400).send({ message: 'Invalid credentials' })
    }

    //consulta o saldo do usuário na tabela cashbacks
    const cashback = await prisma.cashback.findFirst({
      where: { user_id: user.id },
      select: { amount: true },
    })

    const userBalance = cashback ? cashback.amount : 0

    const token = await reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id, expiresIn: '15m' } },
    )

    const refreshToken = await reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id, expiresIn: '7d' } },
    )

    // Salva o refresh token no banco de dados
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        token: refreshToken,
      },
    })

    return reply.status(200).send({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        balance: userBalance,
      },
      accessToken: token,
      refreshToken,
    })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }
    throw err
  }
}
