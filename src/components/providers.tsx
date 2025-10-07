'use client'

import { useState, useEffect } from "react"
import { ThemeProvider } from "@/contexts/theme-context"

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Use this to fix hydration issues
  return (
    <>
      <ThemeProvider>{children}</ThemeProvider>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            try {
              if (localStorage.getItem('theme') === 'dark') {
                document.documentElement.classList.add('dark');
              }
            } catch (e) {}
          `,
        }}
      />
    </>
  )
}