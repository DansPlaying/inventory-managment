import { prisma } from "@/app/services/db"
export const DEFAULT_PAGE_SIZE = 20
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100]

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
  const [totalProducts, totalStock, totalCategories, totalSales] = await Promise.all([
    prisma.product.count(),
    prisma.product.aggregate({ _sum: { stock: true } }),
    prisma.productCategory.count(),
    prisma.sale.aggregate({
      _sum: { total: true },
      where: { status: { in: ['COMPLETED', 'CREDIT'] } }
    }),
  ])

  return {
    totalProducts,
    totalStock: totalStock._sum.stock || 0,
    totalCategories,
    totalSales: totalSales._sum.total || 0,
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

// Credit Control data functions
export const fetchClients = async () => {
  return prisma.client.findMany({
    orderBy: { name: 'asc' },
  })
}

export const fetchClientById = async (id: number) => {
  return prisma.client.findUnique({
    where: { id },
    include: {
      sales: {
        include: {
          items: { include: { product: true } },
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}

export const fetchOpenSales = async () => {
  return prisma.sale.findMany({
    where: { status: 'OPEN' },
    include: {
      client: true,
      items: { include: { product: true } },
      payments: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export const fetchCreditSales = async () => {
  return prisma.sale.findMany({
    where: { status: 'CREDIT' },
    include: {
      client: true,
      items: { include: { product: true } },
      payments: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export const fetchAllSales = async (status?: string) => {
  return prisma.sale.findMany({
    where: status ? { status: status as 'OPEN' | 'COMPLETED' | 'CREDIT' | 'CANCELLED' } : undefined,
    include: {
      client: true,
      items: { include: { product: true } },
      payments: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export const fetchSaleById = async (id: number) => {
  return prisma.sale.findUnique({
    where: { id },
    include: {
      client: true,
      items: { include: { product: true } },
      payments: true,
    },
  })
}

export const fetchProductsForSale = async () => {
  return prisma.product.findMany({
    where: { stock: { gt: 0 } },
    include: { category: true },
    orderBy: { name: 'asc' },
  })
}

export const fetchCompletedSales = async (
  page: number = 1,
  pageSize: number = 10,
  startDate?: string,
  endDate?: string
) => {
  const skip = (page - 1) * pageSize

  const dateFilter: { closedAt?: { gte?: Date; lte?: Date } } = {}
  if (startDate || endDate) {
    dateFilter.closedAt = {}
    if (startDate) {
      dateFilter.closedAt.gte = new Date(startDate)
    }
    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      dateFilter.closedAt.lte = end
    }
  }

  const [sales, total] = await Promise.all([
    prisma.sale.findMany({
      where: {
        status: 'COMPLETED',
        ...dateFilter,
      },
      include: {
        client: true,
        items: { include: { product: true } },
        payments: true,
      },
      orderBy: { closedAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.sale.count({
      where: {
        status: 'COMPLETED',
        ...dateFilter,
      },
    }),
  ])

  return { sales, total, totalPages: Math.ceil(total / pageSize) }
}
