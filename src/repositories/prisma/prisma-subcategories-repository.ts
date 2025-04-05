import { prisma } from '@/lib/prisma'
import { SubCategory, Prisma } from '@prisma/client'
import { SubCategoriesRepository } from './Iprisma/subcategories-repository'
export class PrismaSubCategoriesRepository implements SubCategoriesRepository {
  async listMany(): Promise<SubCategory[]> {
    const subcategories = await prisma.subCategory.findMany()
    return subcategories
  }

  async findById(id: string) {
    const subcategory = await prisma.subCategory.findUnique({
      where: {
        id,
      },
    })
    return subcategory
  }

  async findByCategory(category_id?: string): Promise<SubCategory[]> {
    const subcategory = await prisma.subCategory.findMany({
      where: {
        category_id,
      },
    })
    return subcategory
  }

  async listByCategory(categoryId: string): Promise<SubCategory[]> {
    if (!categoryId) {
      throw new Error('O ID da categoria é obrigatório.')
    }

    const subcategories = await prisma.subCategory.findMany({
      where: {
        category_id: categoryId,
      },
      include: {
        Category: {
          select: {
            id: true,
            name: true, // Aqui você especifica os campos que quer incluir da tabela Category
          },
        },
      },
    })

    return subcategories
  }

  async searchMany(query?: string, page: number = 1): Promise<SubCategory[]> {
    // Se o query for vazio ou não fornecido, retorna todas as categorias paginadas
    if (!query) {
      return await prisma.subCategory.findMany({
        skip: (page - 1) * 20,
        take: 20,
      })
    }

    // Busca as categorias com base no query category_id
    return await prisma.subCategory.findMany({
      where: {
        category_id: {
          equals: query,
          mode: 'insensitive', // Busca case-insensitive (maíuscula ou minúscula)
        },
      },
      skip: (page - 1) * 20,
      take: 20,
    })
  }

  async create(data: Prisma.SubCategoryUncheckedCreateInput) {
    const subcategory = await prisma.subCategory.create({
      data,
    })
    return subcategory
  }
}
