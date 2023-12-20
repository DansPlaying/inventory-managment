'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from "@/app/services/db"

const FormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Please complete the name.',
  }),
  description: z.string(),
  // category: z.string(),
  price: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  stock: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  updatedAt: z.date(),
});

const UpdateInvoice = FormSchema.omit({ id: true, updatedAt: true });

export type State = {
  errors?: {
    name?: string[];
    description?: string[];
    category?: string[];
    price?: string[]; 
    stock?: string[];
  };
  message?: string | null;
};

export async function updateProduct(
  id: number,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    name: formData.get('name'),
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

  const { name, price, description, stock } = validatedFields.data;
  const amountInCents = price * 100;

  try {
    await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        stock: stock,
        description: description,
       
        price: amountInCents,
      },
    });
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/stock');
  redirect('/stock');
}