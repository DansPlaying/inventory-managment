import { fetchOpenSales, fetchCreditSales, fetchClients, fetchProductsForSale, fetchCompletedSales } from '@/app/lib/stock/data'
import { Metadata } from 'next'
import { Suspense } from 'react'
import SalesGrid from '@/app/ui/creditControl/sales-grid'
import NewSaleButton from '@/app/ui/creditControl/new-sale-button'
import CreditSalesTable from '@/app/ui/creditControl/credit-sales-table'
import CompletedOrdersTable from '@/app/ui/creditControl/completed-orders-table'

export const metadata: Metadata = {
  title: 'Credit Control',
}

export default async function CreditControlPage({
  searchParams,
}: {
  searchParams: Promise<{ ordersPage?: string; startDate?: string; endDate?: string }>
}) {
  const params = await searchParams
  const ordersPage = parseInt(params.ordersPage || '1')
  const startDate = params.startDate
  const endDate = params.endDate

  const [openSales, creditSales, clients, products, completedOrders] = await Promise.all([
    fetchOpenSales(),
    fetchCreditSales(),
    fetchClients(),
    fetchProductsForSale(),
    fetchCompletedSales(ordersPage, 10, startDate, endDate),
  ])

  return (
    <main className='flex flex-col py-6 px-6 gap-6 h-full overflow-auto'>
      <div className='flex flex-col items-center gap-4 w-full'>
        <h3 className='text-3xl'>Credit Control</h3>
        <hr className='w-full' style={{ borderColor: 'var(--color-border)' }} />
      </div>

      {/* Open Sales Section */}
      <div className='flex justify-between items-center'>
        <h4 className='text-xl'>Open Tabs ({openSales.length})</h4>
        <NewSaleButton clients={clients} />
      </div>

      <SalesGrid sales={openSales} products={products} />

      {/* Credit Sales Section */}
      {creditSales.length > 0 && (
        <div className='mt-4'>
          <h4 className='text-xl mb-4'>Pending Credit ({creditSales.length})</h4>
          <CreditSalesTable sales={creditSales} products={products} />
        </div>
      )}

      {/* Completed Orders Section */}
      <div className='mt-4'>
        <h4 className='text-xl mb-4'>Completed Orders</h4>
        <Suspense fallback={<div className='text-muted'>Loading orders...</div>}>
          <CompletedOrdersTable
            sales={completedOrders.sales}
            total={completedOrders.total}
            totalPages={completedOrders.totalPages}
            currentPage={ordersPage}
            startDate={startDate}
            endDate={endDate}
          />
        </Suspense>
      </div>
    </main>
  )
}
