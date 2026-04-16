import { fetchStockPages, fetchCategories, DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/app/lib/stock/data';
import Search from '@/app/ui/components/search';
import { CreateProduct } from '@/app/ui/stock/buttons';
import CategoryManager from '@/app/ui/stock/category-manager';
import PageSizeSelector from '@/app/ui/stock/page-size-selector';
import Pagination from '@/app/ui/stock/pagination';
import StockTable from '@/app/ui/stock/table';
import { Metadata } from 'next'
import { Suspense } from 'react';


export const metadata: Metadata = {
  title: 'Stock',
};
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    pageSize?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const requestedPageSize = Number(searchParams?.pageSize) || DEFAULT_PAGE_SIZE;
  const pageSize = PAGE_SIZE_OPTIONS.includes(requestedPageSize) ? requestedPageSize : DEFAULT_PAGE_SIZE;

  const [totalPages, categories] = await Promise.all([
    fetchStockPages(query, pageSize),
    fetchCategories(),
  ]);

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
        <div className='flex gap-2 items-center'>
          <CategoryManager categories={categories} />
          <CreateProduct />
        </div>
      </div>
      <div className='w-full'>
        <Suspense key={query + currentPage + pageSize} fallback={<h1>Loading...</h1>}>
          <StockTable query={query} currentPage={currentPage} pageSize={pageSize} />
        </Suspense>
      </div>
      <div className='flex flex-col md:flex-row items-center justify-between w-full gap-4'>
        <PageSizeSelector currentPageSize={pageSize} />
        <Pagination totalPages={totalPages} />
      </div>
    </main>
  )
}
