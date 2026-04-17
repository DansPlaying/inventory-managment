"use server"

import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';
import { date, z } from "zod";

import { prisma } from "@/app/services/db";

const FormSchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string({
    invalid_type_error: 'Please enter a name.',
  }).min(1, {
    message: 'Can no be empty'
  }),
  description: z.string({
    invalid_type_error: 'Please enter a description.',
  }).min(1, {
    message: 'Can no be empty'
  }),
  price: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  stock: z.coerce.number().gte(0),
  categoryId: z.coerce.number().optional(),
  image: z.string().min(1).optional(),
});

const CreateProduct = FormSchema.omit({ id: true, createdAt: true, updatedAt: true });

const UpdateProduct = FormSchema.omit({ id: true, createdAt: true, updatedAt: true, name: true });

export type State = {
  errors?: {
    name?: string[];
    description?: string[];
    price?: string[];
    stock?: string[];
    categoryId?: string[];
  };
  message?: string | null;
};

export const createProduct = async (prevState: State, formData: FormData) => {
  const validatedFields = CreateProduct.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    stock: formData.get('stock'),
    categoryId: formData.get('categoryId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { name, description, price, stock, categoryId } = validatedFields.data;
  const amountInCents = price * 100;
  try {
    await prisma.product.create({
      data: {
        name,
        description,
        price: amountInCents,
        stock,
        productCategoryId: categoryId,

      }
    })
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  revalidatePath('/dashboard/stock');
  redirect('/dashboard/stock');
}

export async function updateProduct(
  id: number,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateProduct.safeParse({
    description: formData.get('description'),
    price: formData.get('price'),
    stock: formData.get('stock'),
  });

  console.log(validatedFields)
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const {price, description, stock } = validatedFields.data;
  const amountInCents = price * 100;
  const date = new Date()
  console.log(date)
  try {
    await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        stock,
        description,
        price: amountInCents,
        createdAt: date
      },
    });
  } catch (error) {
    return { message: 'Database Error: Failed to Update Product.' };
  }

  revalidatePath('/dashboard/stock');
  redirect('/dashboard/stock');
}

// Category Actions
const CategorySchema = z.object({
  id: z.number(),
  name: z.string({
    invalid_type_error: 'Please enter a category name.',
  }).min(1, {
    message: 'Category name cannot be empty'
  }),
});

const CreateCategory = CategorySchema.omit({ id: true });

export type CategoryState = {
  errors?: {
    name?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export const createCategory = async (prevState: CategoryState, formData: FormData): Promise<CategoryState> => {
  const validatedFields = CreateCategory.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Category.',
    };
  }

  const { name } = validatedFields.data;

  try {
    await prisma.productCategory.create({
      data: { name },
    });
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Category.',
    };
  }

  revalidatePath('/dashboard/stock');
  return { success: true, message: 'Category created successfully!' };
};

export const updateCategory = async (
  id: number,
  prevState: CategoryState,
  formData: FormData,
): Promise<CategoryState> => {
  const validatedFields = CreateCategory.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Category.',
    };
  }

  const { name } = validatedFields.data;

  try {
    await prisma.productCategory.update({
      where: { id },
      data: { name },
    });
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Category.',
    };
  }

  revalidatePath('/dashboard/stock');
  return { success: true, message: 'Category updated successfully!' };
};

export const deleteCategory = async (id: number): Promise<CategoryState> => {
  try {
    // Check if category has products
    const productsCount = await prisma.product.count({
      where: { productCategoryId: id },
    });

    if (productsCount > 0) {
      return {
        message: `Cannot delete category. It has ${productsCount} products associated.`,
      };
    }

    await prisma.productCategory.delete({
      where: { id },
    });
  } catch (error) {
    return {
      message: 'Database Error: Failed to Delete Category.',
    };
  }

  revalidatePath('/dashboard/stock');
  return { success: true, message: 'Category deleted successfully!' };
};

// ============ Credit Control Actions ============

// Client Schema
const ClientSchema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: 'Name is required' }),
  ci: z.string().min(1, { message: 'CI is required' }),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
});

const CreateClient = ClientSchema.omit({ id: true });

export type ClientState = {
  errors?: {
    name?: string[];
    ci?: string[];
    phone?: string[];
    email?: string[];
  };
  message?: string | null;
  success?: boolean;
  clientId?: number;
};

export const createClient = async (prevState: ClientState, formData: FormData): Promise<ClientState> => {
  const validatedFields = CreateClient.safeParse({
    name: formData.get('name'),
    ci: formData.get('ci'),
    phone: formData.get('phone') || undefined,
    email: formData.get('email') || undefined,
    address: formData.get('address') || undefined,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Client.',
    };
  }

  try {
    const client = await prisma.client.create({
      data: validatedFields.data,
    });
    revalidatePath('/dashboard/creditControl');
    return { success: true, message: 'Client created successfully!', clientId: client.id };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return { message: 'A client with this CI already exists.' };
    }
    return { message: 'Database Error: Failed to Create Client.' };
  }
};

export const findOrCreateClient = async (name: string, ci: string): Promise<{ success: boolean; clientId?: number; message?: string }> => {
  try {
    let client = await prisma.client.findUnique({ where: { ci } });

    if (!client) {
      client = await prisma.client.create({
        data: { name, ci },
      });
    }

    return { success: true, clientId: client.id };
  } catch (error) {
    return { success: false, message: 'Failed to find or create client.' };
  }
};

// Sale Actions
export type SaleState = {
  message?: string | null;
  success?: boolean;
  saleId?: number;
};

export const createSale = async (clientId: number): Promise<SaleState> => {
  try {
    const sale = await prisma.sale.create({
      data: {
        clientId,
        status: 'OPEN',
        subtotal: 0,
        total: 0,
      },
    });
    revalidatePath('/dashboard/creditControl');
    return { success: true, saleId: sale.id };
  } catch (error) {
    return { message: 'Failed to create sale.' };
  }
};

export const addItemToSale = async (
  saleId: number,
  productId: number,
  quantity: number
): Promise<SaleState> => {
  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return { message: 'Product not found.' };
    if (product.stock < quantity) return { message: 'Insufficient stock.' };

    const unitPrice = product.price;
    const total = unitPrice * quantity;

    // Check if item already exists in sale
    const existingItem = await prisma.saleItem.findFirst({
      where: { saleId, productId },
    });

    if (existingItem) {
      // Update existing item
      await prisma.saleItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          total: existingItem.total + total,
        },
      });
    } else {
      // Create new item
      await prisma.saleItem.create({
        data: { saleId, productId, quantity, unitPrice, total },
      });
    }

    // Update product stock
    await prisma.product.update({
      where: { id: productId },
      data: { stock: product.stock - quantity },
    });

    // Update sale totals
    const saleItems = await prisma.saleItem.findMany({ where: { saleId } });
    const subtotal = saleItems.reduce((sum, item) => sum + item.total, 0);
    await prisma.sale.update({
      where: { id: saleId },
      data: { subtotal, total: subtotal },
    });

    revalidatePath('/dashboard/creditControl');
    return { success: true };
  } catch (error) {
    return { message: 'Failed to add item to sale.' };
  }
};

export const removeItemFromSale = async (saleItemId: number): Promise<SaleState> => {
  try {
    const item = await prisma.saleItem.findUnique({
      where: { id: saleItemId },
      include: { sale: true },
    });
    if (!item) return { message: 'Item not found.' };

    // Restore product stock
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } },
    });

    // Delete item
    await prisma.saleItem.delete({ where: { id: saleItemId } });

    // Update sale totals
    const saleItems = await prisma.saleItem.findMany({ where: { saleId: item.saleId } });
    const subtotal = saleItems.reduce((sum, i) => sum + i.total, 0);
    await prisma.sale.update({
      where: { id: item.saleId },
      data: { subtotal, total: subtotal },
    });

    revalidatePath('/dashboard/creditControl');
    return { success: true };
  } catch (error) {
    return { message: 'Failed to remove item from sale.' };
  }
};

export const completeSale = async (
  saleId: number,
  paymentMethod: string,
  payNow: boolean
): Promise<SaleState> => {
  try {
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: { items: true },
    });
    if (!sale) return { message: 'Sale not found.' };
    if (sale.items.length === 0) return { message: 'Cannot complete empty sale.' };

    if (payNow) {
      // Create payment and mark as completed
      await prisma.payment.create({
        data: {
          saleId,
          amount: sale.total,
          method: paymentMethod as 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'TRANSFER' | 'MOBILE_PAYMENT' | 'OTHER',
        },
      });
      await prisma.sale.update({
        where: { id: saleId },
        data: { status: 'COMPLETED', closedAt: new Date() },
      });
    } else {
      // Mark as credit (pending payment)
      await prisma.sale.update({
        where: { id: saleId },
        data: { status: 'CREDIT', closedAt: new Date() },
      });
    }

    revalidatePath('/dashboard/creditControl');
    return { success: true };
  } catch (error) {
    return { message: 'Failed to complete sale.' };
  }
};

export const addPaymentToSale = async (
  saleId: number,
  amount: number,
  method: string
): Promise<SaleState> => {
  try {
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: { payments: true },
    });
    if (!sale) return { message: 'Sale not found.' };

    const totalPaid = sale.payments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = sale.total - totalPaid;

    if (amount > remaining) {
      return { message: `Amount exceeds remaining balance of $${remaining.toFixed(2)}` };
    }

    await prisma.payment.create({
      data: {
        saleId,
        amount,
        method: method as 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'TRANSFER' | 'MOBILE_PAYMENT' | 'OTHER',
      },
    });

    // Check if fully paid
    if (totalPaid + amount >= sale.total) {
      await prisma.sale.update({
        where: { id: saleId },
        data: { status: 'COMPLETED' },
      });
    }

    revalidatePath('/dashboard/creditControl');
    return { success: true };
  } catch (error) {
    return { message: 'Failed to add payment.' };
  }
};

export const cancelSale = async (saleId: number): Promise<SaleState> => {
  try {
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: { items: true },
    });
    if (!sale) return { message: 'Sale not found.' };

    // Restore stock for all items
    for (const item of sale.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    // Mark as cancelled
    await prisma.sale.update({
      where: { id: saleId },
      data: { status: 'CANCELLED', closedAt: new Date() },
    });

    revalidatePath('/dashboard/creditControl');
    return { success: true };
  } catch (error) {
    return { message: 'Failed to cancel sale.' };
  }
};