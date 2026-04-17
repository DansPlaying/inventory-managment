'use client'

import { useState } from 'react'
import { CiTrash, CiCirclePlus, CiCircleCheck } from 'react-icons/ci'
import { addItemToSale, removeItemFromSale, completeSale, cancelSale } from '@/app/lib/stock/actions'
import SearchableSelect from './searchable-select'

type Product = {
  id: number
  name: string
  price: number
  stock: number
  category: { name: string } | null
}

type SaleItemProduct = {
  id: number
  name: string
  price: number
}

type SaleItem = {
  id: number
  quantity: number
  unitPrice: number
  total: number
  product: SaleItemProduct
}

type Sale = {
  id: number
  createdAt: Date
  total: number
  client: {
    id: number
    name: string
    ci: string
  }
  items: SaleItem[]
}

export default function SalesGrid({
  sales,
  products,
}: {
  sales: Sale[]
  products: Product[]
}) {
  const [expandedSale, setExpandedSale] = useState<number | null>(null)
  const [loading, setLoading] = useState<number | null>(null)

  if (sales.length === 0) {
    return (
      <div
        className='p-8 rounded-lg text-center'
        style={{ backgroundColor: 'var(--color-tertiary)', borderColor: 'var(--color-border)', borderWidth: '1px' }}
      >
        <p className='text-muted'>No open tabs. Click "New Tab" to start a sale.</p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start'>
      {sales.map((sale) => (
        <SaleCard
          key={sale.id}
          sale={sale}
          products={products}
          isExpanded={expandedSale === sale.id}
          onToggle={() => setExpandedSale(expandedSale === sale.id ? null : sale.id)}
          loading={loading === sale.id}
          setLoading={setLoading}
        />
      ))}
    </div>
  )
}

function SaleCard({
  sale,
  products,
  isExpanded,
  onToggle,
  loading,
  setLoading,
}: {
  sale: Sale
  products: Product[]
  isExpanded: boolean
  onToggle: () => void
  loading: boolean
  setLoading: (id: number | null) => void
}) {
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<number | ''>('')
  const [quantity, setQuantity] = useState(1)
  const [showComplete, setShowComplete] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [payNow, setPayNow] = useState(true)

  const handleAddItem = async () => {
    if (!selectedProduct) return
    setLoading(sale.id)
    await addItemToSale(sale.id, selectedProduct as number, quantity)
    setSelectedProduct('')
    setQuantity(1)
    setShowAddProduct(false)
    setLoading(null)
  }

  const handleRemoveItem = async (itemId: number) => {
    setLoading(sale.id)
    await removeItemFromSale(itemId)
    setLoading(null)
  }

  const handleComplete = async () => {
    setLoading(sale.id)
    await completeSale(sale.id, paymentMethod, payNow)
    setShowComplete(false)
    setLoading(null)
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this sale? Stock will be restored.')) return
    setLoading(sale.id)
    await cancelSale(sale.id)
    setLoading(null)
  }

  return (
    <div className='relative'>
      <div
        className='rounded-lg overflow-hidden'
        style={{ backgroundColor: 'var(--color-tertiary)', borderColor: 'var(--color-border)', borderWidth: '1px' }}
      >
        {/* Header */}
        <div
          className='p-4 cursor-pointer hover:bg-dark/50 transition-colors'
          onClick={onToggle}
        >
          <div className='flex justify-between items-start'>
            <div>
              <h5 className='font-semibold'>{sale.client.name}</h5>
              <p className='text-sm text-muted'>{sale.client.ci}</p>
            </div>
            <div className='text-right'>
              <p className='font-bold text-lg'>${sale.total.toFixed(2)}</p>
              <p className='text-xs text-muted'>{sale.items.length} items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content - Overlay */}
      {isExpanded && (
        <div
          className={`absolute left-0 right-0 top-full z-20 rounded-b-lg border-t border-border p-4 shadow-lg transition-opacity ${loading ? 'opacity-70' : ''}`}
          style={{ backgroundColor: 'var(--color-tertiary)', borderColor: 'var(--color-border)', borderWidth: '0 1px 1px 1px' }}
        >
          {/* Loading indicator */}
          {loading && (
            <div className='absolute top-2 right-2'>
              <div className='w-4 h-4 border-2 border-accentPrimary border-t-transparent rounded-full animate-spin' />
            </div>
          )}
          {/* Items List */}
          <div className='space-y-2 mb-4 max-h-48 overflow-auto'>
            {sale.items.length === 0 ? (
              <p className='text-sm text-muted text-center py-2'>No items yet</p>
            ) : (
              sale.items.map((item) => (
                <div key={item.id} className='flex justify-between items-center text-sm'>
                  <div className='flex-1'>
                    <span>{item.product.name}</span>
                    <span className='text-muted ml-2'>x{item.quantity}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span>${item.total.toFixed(2)}</span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className='text-red-500 hover:text-red-400'
                      disabled={loading}
                    >
                      <CiTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Product Form */}
          {showAddProduct ? (
            <div className='space-y-2 mb-4'>
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
                  disabled={loading}
                  className='w-20 px-2 py-1 text-sm rounded border border-border bg-transparent disabled:opacity-50'
                />
                <button
                  onClick={handleAddItem}
                  disabled={!selectedProduct || loading}
                  className='flex-1 px-2 py-1 text-sm bg-accentPrimary text-white rounded hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1'
                >
                  {loading && (
                    <div className='w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  )}
                  {loading ? 'Adding...' : 'Add'}
                </button>
                <button
                  onClick={() => setShowAddProduct(false)}
                  disabled={loading}
                  className='px-2 py-1 text-sm border border-border rounded hover:bg-dark disabled:opacity-50'
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddProduct(true)}
              className='w-full flex items-center justify-center gap-1 px-3 py-2 text-sm border border-dashed border-border rounded hover:border-accentPrimary hover:text-accentPrimary transition-colors mb-4'
            >
              <CiCirclePlus /> Add Product
            </button>
          )}

          {/* Complete Sale Form */}
          {showComplete ? (
            <div className='space-y-3 p-3 rounded border border-border'>
              <div>
                <label className='text-sm text-muted'>Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className='w-full px-2 py-1 text-sm rounded border border-border bg-transparent mt-1'
                >
                  <option value='CASH'>Cash</option>
                  <option value='CREDIT_CARD'>Credit Card</option>
                  <option value='DEBIT_CARD'>Debit Card</option>
                  <option value='TRANSFER'>Transfer</option>
                  <option value='MOBILE_PAYMENT'>Mobile Payment</option>
                </select>
              </div>
              <label className='flex items-center gap-2 text-sm'>
                <input
                  type='checkbox'
                  checked={payNow}
                  onChange={(e) => setPayNow(e.target.checked)}
                />
                Pay now (uncheck for credit)
              </label>
              <div className='flex gap-2'>
                <button
                  onClick={handleComplete}
                  disabled={loading || sale.items.length === 0}
                  className='flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:opacity-90 disabled:opacity-50'
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowComplete(false)}
                  className='px-3 py-2 text-sm border border-border rounded hover:bg-dark'
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className='flex gap-2'>
              <button
                onClick={() => setShowComplete(true)}
                disabled={sale.items.length === 0 || loading}
                className='flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:opacity-90 disabled:opacity-50'
              >
                <CiCircleCheck /> Complete
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className='px-3 py-2 text-sm text-red-500 border border-red-500 rounded hover:bg-red-500/10 disabled:opacity-50'
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
