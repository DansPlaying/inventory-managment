import { Metadata } from 'next';

import { fetchCategories, fetchProductById } from '@/app/lib/stock/data';
import EditProductForm from '@/app/ui/stock/edit-form';

export const metadata: Metadata = {
  title: 'Product Edit',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [categories, product] = await Promise.all([
    await fetchCategories(),
    await fetchProductById(id),

  ]);


  return (
    <main className='flex flex-col items-center py-6 px-6 gap-4'>
      <div className='flex flex-col items-center gap-4 w-full'>
        <h1 className='text-3xl'>Edit Product</h1>
        <hr className='w-full' />
      </div>
      <EditProductForm product={product!} categories={categories} />
    </main>
  );
}