import { Metadata } from 'next'
import { Suspense } from 'react';

import Search from '../ui/components/search'
import StockTable from '../ui/stock/table';
import Pagination from '../ui/stock/pagination';
import { fetchStockPages } from '../lib/stock/data';
import { CreateProduct } from '../ui/stock/buttons';

export const metadata: Metadata = {
  title: 'Stock',
};
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchStockPages(query)

  return (
    <main className='flex flex-col items-center py-6 px-6 gap-4'>
      <div className='flex flex-col items-center gap-4 w-full'>
        <h3 className='text-3xl'>In Stock</h3>
        <hr className='w-full' />
      </div>
      <div className='relative flex flex-col md:flex-row justify-between w-full md:items-center gap-4'>
        <div className='w-full max-w-md'>
          <Search placeholder='Quick search' />
        </div>
        <CreateProduct />
      </div>
      <div className='w-full'>
        <Suspense key={query + currentPage} fallback={<h1>Cargando...</h1>}>
          <StockTable query={query} currentPage={currentPage} />
        </Suspense>
      </div>
      <div>
        <Pagination totalPages={totalPages} />
      </div>
    </main>
  )
}
