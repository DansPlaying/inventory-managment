'use client'

import { useState, useRef, useEffect } from 'react'

type Option = {
  value: number
  label: string
  subLabel?: string
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}: {
  options: Option[]
  value: number | ''
  onChange: (value: number | '') => void
  placeholder?: string
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedOption = options.find((o) => o.value === value)

  const filteredOptions = options.filter(
    (o) =>
      o.label.toLowerCase().includes(search.toLowerCase()) ||
      (o.subLabel && o.subLabel.toLowerCase().includes(search.toLowerCase()))
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (optionValue: number) => {
    onChange(optionValue)
    setIsOpen(false)
    setSearch('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    if (!isOpen) setIsOpen(true)
  }

  const handleFocus = () => {
    setIsOpen(true)
    setSearch('')
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    setSearch('')
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className='relative'>
        <input
          ref={inputRef}
          type='text'
          value={isOpen ? search : selectedOption?.label || ''}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className='w-full px-2 py-1 text-sm rounded border border-border bg-transparent pr-8'
        />
        {value && !isOpen && (
          <button
            type='button'
            onClick={handleClear}
            className='absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground'
          >
            ×
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className='absolute z-50 w-full mt-1 max-h-48 overflow-auto rounded border border-border shadow-lg'
          style={{ backgroundColor: 'var(--color-tertiary)' }}
        >
          {filteredOptions.length === 0 ? (
            <div className='px-2 py-2 text-sm text-muted'>No results found</div>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`px-2 py-2 text-sm cursor-pointer hover:bg-dark/50 ${
                  option.value === value ? 'bg-accentPrimary/20' : ''
                }`}
              >
                <div>{option.label}</div>
                {option.subLabel && <div className='text-xs text-muted'>{option.subLabel}</div>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
