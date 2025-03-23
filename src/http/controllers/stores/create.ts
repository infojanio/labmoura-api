import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateStoreUseCase } from '@/factories/make-create-store-use-case'
import { makeAddressUseCase } from '@/factories/make-create-address-use-case'
import { StoreAlreadyExistsError } from '@/utils/messages/errors/store-already-exists-error'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createStoreBodySchema = z.object({
    // id: z.string(),
    name: z.string(),
    slug: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      store_id: z.string().optional(),
    }),
  })

  const {
    // id,
    name,
    slug,
    latitude,
    longitude,
    address,
  } = createStoreBodySchema.parse(request.body)

  try {
    const storeUseCase = makeCreateStoreUseCase()

    const { store } = await storeUseCase.execute({
      // id,
      name,
      slug,
      latitude,
      longitude,
      address,
    })

    // Cria o endereço associado a loja
    const createAddressUseCase = makeAddressUseCase()

    const storeAddress = await createAddressUseCase.execute({
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      store_id: store.id, //PEGA O ID DA LOJA na tabela de loja e salva na tabela de endereços
    })

    // Retorna status 201, mensagem de sucesso e os dados do usuário criado
    return reply.status(201).send({
      message: 'Cadastro realizado com sucesso!',
      store,
      address: storeAddress,
    })
  } catch (error) {
    if (error instanceof StoreAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
    console.log('está aqui: ', error)
    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
