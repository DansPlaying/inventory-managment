'use client'

import { useState } from 'react'
import { CiCirclePlus } from 'react-icons/ci'
import { createClient, createSale, findOrCreateClient } from '@/app/lib/stock/actions'
import SearchableSelect from './searchable-select'

type Client = {
  id: number
  name: string
  ci: string
}

export default function NewSaleButton({ clients }: { clients: Client[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isNewClient, setIsNewClient] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<number | ''>('')
  const [name, setName] = useState('')
  const [ci, setCi] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let clientId: number

      if (isNewClient) {
        // Create new client
        const result = await findOrCreateClient(name, ci)
        if (!result.success || !result.clientId) {
          setError(result.message || 'Failed to create client')
          setLoading(false)
          return
        }
        clientId = result.clientId
      } else {
        if (!selectedClientId) {
          setError('Please select a client')
          setLoading(false)
          return
        }
        clientId = selectedClientId as number
      }

      // Create sale
      const saleResult = await createSale(clientId)
      if (!saleResult.success) {
        setError(saleResult.message || 'Failed to create sale')
        setLoading(false)
        return
      }

      // Reset and close
      setIsOpen(false)
      setSelectedClientId('')
      setName('')
      setCi('')
      setIsNewClient(false)
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='flex items-center gap-2 px-4 py-2 bg-accentPrimary text-white rounded-lg hover:opacity-90 transition-opacity'
      >
        <CiCirclePlus className='text-xl' />
        New Tab
      </button>

      {isOpen && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div
            className='rounded-lg p-6 w-full max-w-md'
            style={{ backgroundColor: 'var(--color-tertiary)', borderColor: 'var(--color-border)', borderWidth: '1px' }}
          >
            <h3 className='text-xl mb-4'>Open New Tab</h3>

            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <label className='flex items-center gap-2 mb-3'>
                  <input
                    type='checkbox'
                    checked={isNewClient}
                    onChange={(e) => setIsNewClient(e.target.checked)}
                    className='w-4 h-4'
                  />
                  <span>New Client</span>
                </label>

                {isNewClient ? (
                  <div className='space-y-3'>
                    <input
                      type='text'
                      placeholder='Client Name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className='w-full px-3 py-2 rounded-md border border-border bg-transparent focus:outline-none focus:border-accentPrimary'
                      required
                    />
                    <input
                      type='text'
                      placeholder='CI (ID Number)'
                      value={ci}
                      onChange={(e) => setCi(e.target.value)}
                      className='w-full px-3 py-2 rounded-md border border-border bg-transparent focus:outline-none focus:border-accentPrimary'
                      required
                    />
                  </div>
                ) : (
                  <SearchableSelect
                    options={clients.map((client) => ({
                      value: client.id,
                      label: client.name,
                      subLabel: client.ci,
                    }))}
                    value={selectedClientId}
                    onChange={setSelectedClientId}
                    placeholder='Search client...'
                    className='w-full'
                  />
                )}
              </div>

              {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

              <div className='flex justify-end gap-3'>
                <button
                  type='button'
                  onClick={() => setIsOpen(false)}
                  className='px-4 py-2 border border-border rounded-lg hover:bg-dark transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={loading}
                  className='px-4 py-2 bg-accentPrimary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50'
                >
                  {loading ? 'Creating...' : 'Open Tab'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
