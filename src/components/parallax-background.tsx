'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ParallaxLayer from './parallax-layer'

type Star = {
  top: string
  left: string
  duration: string
}

const ParallaxBackground = () => {
  const [mounted, setMounted] = useState(false)
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    setMounted(true)

    // generate random stars ONLY on client
    const generatedStars: Star[] = Array.from({ length: 20 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: `${2 + Math.random() * 3}s`,
    }))

    setStars(generatedStars)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-purple-900 to-pink-900" />

      {/* Slow moving background elements */}
      <ParallaxLayer speed={0.3} direction="up">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>
      </ParallaxLayer>

      {/* Medium speed geometric shapes */}
      <ParallaxLayer speed={0.5} direction="down">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-40 left-20 w-40 h-40 bg-linear-to-br from-purple-400 to-pink-400 rotate-45 rounded-lg" />
          <div className="absolute top-30 right-20 w-32 h-32 bg-linear-to-br from-blue-400 to-cyan-400 -rotate-12 rounded-lg" />
          <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-linear-to-br from-green-400 to-teal-400 rotate-12 rounded-full" />
          <div className="absolute top-1/4 right-1/4 w-36 h-36 bg-linear-to-br from-orange-400 to-red-400 rotate-30 rounded-lg" />
          <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-linear-to-br from-indigo-400 to-purple-400 -rotate-45 rounded-lg" />
          <div className="absolute top-2/3 left-2/3 w-32 h-32 bg-linear-to-br from-emerald-400 to-blue-400 rotate-60 rounded-full" />
        </div>
      </ParallaxLayer>

      {/* Fast moving small elements (FIXED) */}
      <ParallaxLayer speed={0.8} direction="up">
        <div className="absolute inset-0 opacity-15">
          {stars.map((star, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                top: star.top,
                left: star.left,
                animation: `twinkle ${star.duration} infinite`,
              }}
            />
          ))}
        </div>
      </ParallaxLayer>

      {/* Grid pattern */}
      <ParallaxLayer speed={0.2} direction="down">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </ParallaxLayer>

      {/* Floating orbs */}
      <ParallaxLayer speed={0.6} direction="up">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-20 h-20 bg-linear-to-br from-purple-400 to-pink-400 rounded-full blur-xl"
            animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-3/4 right-1/4 w-16 h-16 bg-linear-to-br from-blue-400 to-cyan-400 rounded-full blur-xl"
            animate={{ y: [0, 20, 0], scale: [1, 0.9, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/2 left-3/4 w-12 h-12 bg-linear-to-br from-green-400 to-teal-400 rounded-full blur-xl"
            animate={{ y: [0, -15, 0], x: [0, 10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </ParallaxLayer>

      {/* Twinkle animation */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default ParallaxBackground
