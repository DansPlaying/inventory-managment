'use client'

import { useState, Fragment } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Payment = {
  id: number
  amount: number
  method: string
  createdAt: Date
}

type SaleItem = {
  id: number
  quantity: number
  total: number
  product: { name: string }
}

type Sale = {
  id: number
  createdAt: Date
  closedAt: Date | null
  total: number
  client: {
    id: number
    name: string
    ci: string
  }
  items: SaleItem[]
  payments: Payment[]
}

export default function CompletedOrdersTable({
  sales,
  total,
  totalPages,
  currentPage,
  startDate,
  endDate,
}: {
  sales: Sale[]
  total: number
  totalPages: number
  currentPage: number
  startDate?: string
  endDate?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [expandedSale, setExpandedSale] = useState<number | null>(null)
  const [localStartDate, setLocalStartDate] = useState(startDate || '')
  const [localEndDate, setLocalEndDate] = useState(endDate || '')

  const updateFilters = (page?: number, start?: string, end?: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (page !== undefined) {
      params.set('ordersPage', page.toString())
    }
    if (start !== undefined) {
      if (start) params.set('startDate', start)
      else params.delete('startDate')
    }
    if (end !== undefined) {
      if (end) params.set('endDate', end)
      else params.delete('endDate')
    }

    router.push(`?${params.toString()}`)
  }

  const handleFilter = () => {
    updateFilters(1, localStartDate, localEndDate)
  }

  const handleClearFilter = () => {
    setLocalStartDate('')
    setLocalEndDate('')
    updateFilters(1, '', '')
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className='space-y-4'>
      {/* Date Filter */}
      <div className='flex flex-wrap items-end gap-3'>
        <div>
          <label className='text-xs text-muted block mb-1'>From</label>
          <input
            type='date'
            value={localStartDate}
            onChange={(e) => setLocalStartDate(e.target.value)}
            className='px-3 py-1.5 text-sm rounded border border-border bg-transparent'
          />
        </div>
        <div>
          <label className='text-xs text-muted block mb-1'>To</label>
          <input
            type='date'
            value={localEndDate}
            onChange={(e) => setLocalEndDate(e.target.value)}
            className='px-3 py-1.5 text-sm rounded border border-border bg-transparent'
          />
        </div>
        <button
          onClick={handleFilter}
          className='px-4 py-1.5 text-sm bg-accentPrimary text-white rounded hover:opacity-90'
        >
          Filter
        </button>
        {(startDate || endDate) && (
          <button
            onClick={handleClearFilter}
            className='px-4 py-1.5 text-sm border border-border rounded hover:bg-dark'
          >
            Clear
          </button>
        )}
        <span className='text-sm text-muted ml-auto'>{total} orders</span>
      </div>

      {/* Table */}
      <div
        className='rounded-lg overflow-x-auto'
        style={{ backgroundColor: 'var(--color-tertiary)', borderColor: 'var(--color-border)', borderWidth: '1px' }}
      >
        <table className='w-full min-w-[600px]'>
          <thead>
            <tr className='border-b border-border'>
              <th className='text-left px-4 py-3 text-sm font-medium'>Client</th>
              <th className='text-left px-4 py-3 text-sm font-medium'>Date</th>
              <th className='text-right px-4 py-3 text-sm font-medium'>Items</th>
              <th className='text-right px-4 py-3 text-sm font-medium'>Total</th>
              <th className='text-left px-4 py-3 text-sm font-medium'>Payment</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan={5} className='px-4 py-8 text-center text-muted'>
                  No completed orders found
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <Fragment key={sale.id}>
                  <tr
                    className='border-b border-border hover:bg-dark/30 cursor-pointer'
                    onClick={() => setExpandedSale(expandedSale === sale.id ? null : sale.id)}
                  >
                    <td className='px-4 py-3'>
                      <div>
                        <p className='font-medium'>{sale.client.name}</p>
                        <p className='text-xs text-muted'>{sale.client.ci}</p>
                      </div>
                    </td>
                    <td className='px-4 py-3 text-sm'>{formatDateTime(sale.closedAt || sale.createdAt)}</td>
                    <td className='px-4 py-3 text-sm text-right'>{sale.items.length}</td>
                    <td className='px-4 py-3 text-sm text-right font-medium'>${sale.total.toFixed(2)}</td>
                    <td className='px-4 py-3 text-sm'>
                      {sale.payments.map((p) => p.method.replace('_', ' ')).join(', ')}
                    </td>
                  </tr>

                  {expandedSale === sale.id && (
                    <tr>
                      <td colSpan={5} className='px-4 py-3 bg-dark/20'>
                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <h6 className='text-sm font-medium mb-2'>Items</h6>
                            <ul className='text-sm space-y-1'>
                              {sale.items.map((item) => (
                                <li key={item.id} className='flex justify-between'>
                                  <span>{item.product.name} x{item.quantity}</span>
                                  <span>${item.total.toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h6 className='text-sm font-medium mb-2'>Payments</h6>
                            <ul className='text-sm space-y-1'>
                              {sale.payments.map((payment) => (
                                <li key={payment.id} className='flex justify-between'>
                                  <span>{payment.method.replace('_', ' ')}</span>
                                  <span className='text-green-500'>${payment.amount.toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex items-center justify-center gap-2'>
          <button
            onClick={() => updateFilters(currentPage - 1)}
            disabled={currentPage <= 1}
            className='px-3 py-1 text-sm border border-border rounded hover:bg-dark disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Previous
          </button>
          <div className='flex gap-1'>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (totalPages <= 7) return true
                if (page === 1 || page === totalPages) return true
                if (Math.abs(page - currentPage) <= 1) return true
                return false
              })
              .map((page, index, arr) => {
                const showEllipsis = index > 0 && page - arr[index - 1] > 1
                return (
                  <span key={page} className='flex items-center'>
                    {showEllipsis && <span className='px-2 text-muted'>...</span>}
                    <button
                      onClick={() => updateFilters(page)}
                      className={`w-8 h-8 text-sm rounded ${
                        page === currentPage
                          ? 'bg-accentPrimary text-white'
                          : 'border border-border hover:bg-dark'
                      }`}
                    >
                      {page}
                    </button>
                  </span>
                )
              })}
          </div>
          <button
            onClick={() => updateFilters(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className='px-3 py-1 text-sm border border-border rounded hover:bg-dark disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
