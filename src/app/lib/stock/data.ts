import { prisma } from "@/app/services/db"
export const DEFAULT_PAGE_SIZE = 5
export const PAGE_SIZE_OPTIONS = [5, 10, 50, 100]

export const fetchStockPages = async (query: string, pageSize: number = DEFAULT_PAGE_SIZE) => {
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
  })) / pageSize)
}

export const fetchFilteredStock = async (query: string, currentPage: number, pageSize: number = DEFAULT_PAGE_SIZE) => {
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
    take: pageSize,
    skip: (currentPage - 1) * pageSize,
  })
}

export const fetchCategories = async () => {
  return prisma.productCategory.findMany({
    orderBy: {
      id: 'asc'
    },
  })
}

export const fetchProductById = async (productId: string) => {
  return prisma.product.findUnique({
    where: {
      id: parseInt(productId),
    },
  });
}

// Dashboard data functions
export const fetchDashboardStats = async () => {
  const [totalProducts, totalStock, totalCategories, totalCarts] = await Promise.all([
    prisma.product.count(),
    prisma.product.aggregate({ _sum: { stock: true } }),
    prisma.productCategory.count(),
    prisma.cart.aggregate({ _sum: { amount: true } }),
  ])

  return {
    totalProducts,
    totalStock: totalStock._sum.stock || 0,
    totalCategories,
    totalSales: totalCarts._sum.amount || 0,
  }
}

export const fetchCategoryStats = async () => {
  const categories = await prisma.productCategory.findMany({
    include: {
      products: {
        select: {
          stock: true,
          price: true,
        },
      },
    },
  })

  return categories.map((cat) => ({
    name: cat.name,
    productCount: cat.products.length,
    totalStock: cat.products.reduce((sum, p) => sum + p.stock, 0),
    totalValue: cat.products.reduce((sum, p) => sum + p.stock * p.price, 0),
  }))
}

export const fetchRecentProducts = async (limit = 5) => {
  return prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  })
}

export const fetchTopStockProducts = async (limit = 5) => {
  return prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      stock: 'desc',
    },
    take: limit,
  })
}
