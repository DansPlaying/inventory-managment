'use client'

import { useState } from 'react'
import { CiCirclePlus, CiTrash } from 'react-icons/ci'
import { addPaymentToSale, addItemToSale, removeItemFromSale } from '@/app/lib/stock/actions'
import SearchableSelect from './searchable-select'

type Product = {
  id: number
  name: string
  price: number
  stock: number
}

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
  product: { id: number; name: string; price: number }
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

export default function CreditSalesTable({
  sales,
  products,
}: {
  sales: Sale[]
  products: Product[]
}) {
  const [expandedSale, setExpandedSale] = useState<number | null>(null)

  return (
    <div
      className='rounded-lg overflow-x-auto'
      style={{ backgroundColor: 'var(--color-tertiary)', borderColor: 'var(--color-border)', borderWidth: '1px' }}
    >
      <table className='w-full min-w-[700px]'>
        <thead>
          <tr className='border-b border-border'>
            <th className='text-left px-4 py-3 text-sm font-medium'>Client</th>
            <th className='text-left px-4 py-3 text-sm font-medium'>Date</th>
            <th className='text-right px-4 py-3 text-sm font-medium'>Total</th>
            <th className='text-right px-4 py-3 text-sm font-medium'>Paid</th>
            <th className='text-right px-4 py-3 text-sm font-medium'>Balance</th>
            <th className='text-center px-4 py-3 text-sm font-medium'>Action</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => {
            const totalPaid = sale.payments.reduce((sum, p) => sum + p.amount, 0)
            const balance = sale.total - totalPaid
            return (
              <CreditSaleRow
                key={sale.id}
                sale={sale}
                products={products}
                totalPaid={totalPaid}
                balance={balance}
                isExpanded={expandedSale === sale.id}
                onToggle={() => setExpandedSale(expandedSale === sale.id ? null : sale.id)}
              />
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function CreditSaleRow({
  sale,
  products,
  totalPaid,
  balance,
  isExpanded,
  onToggle,
}: {
  sale: Sale
  products: Product[]
  totalPaid: number
  balance: number
  isExpanded: boolean
  onToggle: () => void
}) {
  const [showPayment, setShowPayment] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [amount, setAmount] = useState(balance.toString())
  const [method, setMethod] = useState('CASH')
  const [loading, setLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<number | ''>('')
  const [quantity, setQuantity] = useState(1)

  const handlePayment = async () => {
    const paymentAmount = parseFloat(amount)
    if (isNaN(paymentAmount) || paymentAmount <= 0) return

    setLoading(true)
    await addPaymentToSale(sale.id, paymentAmount, method)
    setShowPayment(false)
    setLoading(false)
  }

  const handleAddItem = async () => {
    if (!selectedProduct) return
    setLoading(true)
    await addItemToSale(sale.id, selectedProduct as number, quantity)
    setSelectedProduct('')
    setQuantity(1)
    setShowAddProduct(false)
    setLoading(false)
  }

  const handleRemoveItem = async (itemId: number) => {
    setLoading(true)
    await removeItemFromSale(itemId)
    setLoading(false)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <>
      <tr
        className={`border-b border-border cursor-pointer transition-opacity ${
          loading ? 'opacity-50 pointer-events-none' : 'hover:bg-dark/30'
        }`}
        onClick={onToggle}
      >
        <td className='px-4 py-3'>
          <div className='flex items-center gap-2'>
            {loading && (
              <div className='w-4 h-4 border-2 border-accentPrimary border-t-transparent rounded-full animate-spin' />
            )}
            <div>
              <p className='font-medium'>{sale.client.name}</p>
              <p className='text-xs text-muted'>{sale.client.ci}</p>
            </div>
          </div>
        </td>
        <td className='px-4 py-3 text-sm'>{formatDate(sale.closedAt || sale.createdAt)}</td>
        <td className='px-4 py-3 text-sm text-right'>${sale.total.toFixed(2)}</td>
        <td className='px-4 py-3 text-sm text-right text-green-500'>${totalPaid.toFixed(2)}</td>
        <td className='px-4 py-3 text-sm text-right text-red-500 font-medium'>${balance.toFixed(2)}</td>
        <td className='px-4 py-3 text-center'>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowPayment(!showPayment)
              setAmount(balance.toString())
            }}
            disabled={loading}
            className='px-3 py-1 text-sm bg-green-600 text-white rounded hover:opacity-90 disabled:opacity-50'
          >
            {loading ? 'Processing...' : 'Pay'}
          </button>
        </td>
      </tr>

      {/* Expanded details */}
      {isExpanded && (
        <tr className={loading ? 'opacity-50 pointer-events-none' : ''}>
          <td colSpan={6} className='px-4 py-3 bg-dark/20'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <h6 className='text-sm font-medium'>Items</h6>
                  <button
                    onClick={() => setShowAddProduct(!showAddProduct)}
                    disabled={loading}
                    className='text-xs flex items-center gap-1 text-accentPrimary hover:underline disabled:opacity-50'
                  >
                    <CiCirclePlus /> Add Product
                  </button>
                </div>

                {showAddProduct && (
                  <div className='mb-3 p-2 rounded border border-border space-y-2'>
                    <SearchableSelect
                      options={products.map((p) => ({
                        value: p.id,
                        label: p.name,
                        subLabel: `$${p.price.toFixed(2)} - ${p.stock} in stock`,
                      }))}
                      value={selectedProduct}
                      onChange={setSelectedProduct}
                      placeholder='Search product...'
                    />
                    <div className='flex gap-2'>
                      <input
                        type='number'
                        min='1'
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className='w-16 px-2 py-1 text-sm rounded border border-border bg-transparent'
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddItem()
                        }}
                        disabled={!selectedProduct || loading}
                        className='flex-1 px-2 py-1 text-sm bg-accentPrimary text-white rounded hover:opacity-90 disabled:opacity-50'
                      >
                        Add
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowAddProduct(false)
                        }}
                        className='px-2 py-1 text-sm border border-border rounded hover:bg-dark'
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <ul className='text-sm space-y-1'>
                  {sale.items.map((item) => (
                    <li key={item.id} className='flex justify-between items-center'>
                      <span>{item.product.name} x{item.quantity}</span>
                      <div className='flex items-center gap-2'>
                        <span>${item.total.toFixed(2)}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveItem(item.id)
                          }}
                          className='text-red-500 hover:text-red-400'
                          disabled={loading}
                        >
                          <CiTrash />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h6 className='text-sm font-medium mb-2'>Payments</h6>
                {sale.payments.length === 0 ? (
                  <p className='text-sm text-muted'>No payments yet</p>
                ) : (
                  <ul className='text-sm space-y-1'>
                    {sale.payments.map((payment) => (
                      <li key={payment.id} className='flex justify-between'>
                        <span>{payment.method.replace('_', ' ')}</span>
                        <span className='text-green-500'>${payment.amount.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}

      {/* Payment form */}
      {showPayment && (
        <tr className={loading ? 'opacity-70' : ''}>
          <td colSpan={6} className='px-4 py-3 bg-dark/30'>
            <div className='flex items-center gap-4'>
              <div className='flex-1'>
                <label className='text-xs text-muted'>Amount</label>
                <input
                  type='number'
                  step='0.01'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={loading}
                  className='w-full px-2 py-1 text-sm rounded border border-border bg-transparent disabled:opacity-50'
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className='flex-1'>
                <label className='text-xs text-muted'>Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  disabled={loading}
                  className='w-full px-2 py-1 text-sm rounded border border-border bg-transparent disabled:opacity-50'
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value='CASH'>Cash</option>
                  <option value='CREDIT_CARD'>Credit Card</option>
                  <option value='DEBIT_CARD'>Debit Card</option>
                  <option value='TRANSFER'>Transfer</option>
                  <option value='MOBILE_PAYMENT'>Mobile Payment</option>
                </select>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePayment()
                }}
                disabled={loading}
                className='px-4 py-2 text-sm bg-green-600 text-white rounded hover:opacity-90 disabled:opacity-50 mt-4 flex items-center gap-2'
              >
                {loading && (
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                )}
                {loading ? 'Processing...' : 'Confirm Payment'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowPayment(false)
                }}
                disabled={loading}
                className='px-4 py-2 text-sm border border-border rounded hover:bg-dark mt-4 disabled:opacity-50'
              >
                Cancel
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
