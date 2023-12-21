import { Metadata } from 'next';

import CreateForm from '@/app/ui/stock/create-form';
import { fetchCategories } from '@/app/lib/stock/data';

export const metadata: Metadata = {
  title: 'Product Create',
};

export default async function Page() {
  const categories = await fetchCategories();

  return (
    <main className='flex flex-col items-center py-6 px-6 gap-4'>
      <div className='flex flex-col items-center gap-4 w-full'>
        <h1 className='text-3xl'>Create Product</h1>
        <hr className='w-full' />
      </div>

      {/* <Breadcrumbs
        breadcrumbs={[
          { label: 'Stock', href: '/stock' },
          {
            label: 'Create Product',
            href: '/stock/create',
            active: true,
          },
        ]}
      /> */}
      <CreateForm categories={categories} />
    </main>
  );
}
