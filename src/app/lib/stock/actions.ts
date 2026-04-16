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