'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { BsSun, BsMoon } from 'react-icons/bs'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-12 h-12 rounded-lg bg-tertiary animate-pulse" />
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="
        w-12 h-12
        flex items-center justify-center
        rounded-lg
        bg-tertiary
        hover:bg-accentPrimary
        hover:text-white
        transition-all
        text-xl
        border border-border
        shadow-sm
      "
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <BsSun className="text-yellow-400" />
      ) : (
        <BsMoon className="text-accentPrimary" />
      )}
    </button>
  )
}
