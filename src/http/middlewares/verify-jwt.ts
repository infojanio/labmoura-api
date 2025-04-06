import { FastifyReply, FastifyRequest } from 'fastify'

//verifica se o usuário está logado
export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (error) {
    return reply.status(401).send({
      message: 'token.expired', //tem que ser a mesma mensagem do frontend
    })
  }
}
