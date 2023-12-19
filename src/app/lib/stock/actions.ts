"use server"

import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';
import { z } from "zod";

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

const UpdateProduct = FormSchema.omit({ id: true, createdAt: true, updatedAt: true });

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
  const validatedFields  = CreateProduct.safeParse({
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
  const { name,  description, price, stock, categoryId } = validatedFields.data;
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

  revalidatePath('/stock');
  redirect('/stock');
}
