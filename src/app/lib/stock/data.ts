import { prisma } from "@/app/services/db"
export const ITEMS_PER_PAGE = 5

export const fetchStockPages = async (query: string) => {
  return Math.ceil((await prisma.product.count({
    where: {
      name: {
        contains: query,
        mode: 'insensitive'
      }
    },
    orderBy: {
      id: 'asc'
    },
  })) / ITEMS_PER_PAGE)
}

export const fetchFilteredStock = async (query: string, currentPage: number) => {
  return prisma.product.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive'
      }
    },
    include: {
      category: true
    },
    orderBy: {
      id: 'asc'
    },
    take: ITEMS_PER_PAGE,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
  })
}

export const fetchCategories = async () => {
  return prisma.productCategory.findMany({
    orderBy: {
      id: 'asc'
    },
  })
}
