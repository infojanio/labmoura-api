import { FastifyReply, FastifyRequest } from 'fastify'

//verifica se o usuário está logado
export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    return reply.status(401).send({ message: 'Usuário Unauthorized.' })
  }
}
