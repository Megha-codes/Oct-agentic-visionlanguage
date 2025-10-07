'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light') // Default to light mode
  const [mounted, setMounted] = useState(false)

  // Force light mode on initial load
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
  }, [])

  useEffect(() => {
    setMounted(true)
    // Always default to light mode first
    setTheme('light')
    
    // Then check for saved preference
    try {
      const savedTheme = localStorage.getItem('theme') as Theme
      if (savedTheme === 'dark') {
        setTheme('dark')
      }
    } catch (e) {
      console.warn('localStorage is not available:', e)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      try {
        // Apply theme to document
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(theme)
        // Save theme preference
        localStorage.setItem('theme', theme)
        console.log('Theme changed to:', theme) // Debug log
      } catch (e) {
        console.warn('Error applying theme:', e)
      }
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  // Always provide the same structure to prevent hydration mismatch
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    // Provide a default context instead of throwing an error
    return {
      theme: 'light',
      toggleTheme: () => console.warn('ThemeProvider not found')
    }
  }
  return context
}
