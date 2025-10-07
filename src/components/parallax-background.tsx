'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import ParallaxLayer from './parallax-layer'

const ParallaxBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900" />
      
      {/* Slow moving background elements */}
      <ParallaxLayer speed={0.3} direction="up">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl" />
        </div>
      </ParallaxLayer>
      
      {/* Medium speed geometric shapes */}
      <ParallaxLayer speed={0.5} direction="down">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-40 left-20 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-400 transform rotate-45 rounded-lg" />
          <div className="absolute top-30 right-20 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 transform -rotate-12 rounded-lg" />
          <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-green-400 to-teal-400 transform rotate-12 rounded-full" />
          <div className="absolute top-1/4 right-1/4 w-36 h-36 bg-gradient-to-br from-orange-400 to-red-400 transform rotate-30 rounded-lg" />
          <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-gradient-to-br from-indigo-400 to-purple-400 transform -rotate-45 rounded-lg" />
          <div className="absolute top-2/3 left-2/3 w-32 h-32 bg-gradient-to-br from-emerald-400 to-blue-400 transform rotate-60 rounded-full" />
        </div>
      </ParallaxLayer>
      
      {/* Fast moving small elements */}
      <ParallaxLayer speed={0.8} direction="up">
        <div className="absolute inset-0 opacity-15">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `twinkle ${2 + Math.random() * 3}s infinite`
              }}
            />
          ))}
        </div>
      </ParallaxLayer>
      
      {/* Grid pattern with parallax */}
      <ParallaxLayer speed={0.2} direction="down">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1"/>
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
            className="absolute top-1/4 left-1/4 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full filter blur-xl"
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-3/4 right-1/4 w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full filter blur-xl"
            animate={{
              y: [0, 20, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/2 left-3/4 w-12 h-12 bg-gradient-to-br from-green-400 to-teal-400 rounded-full filter blur-xl"
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </ParallaxLayer>
      
      {/* Wave patterns */}
      <ParallaxLayer speed={0.4} direction="down">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#8B5CF6', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 0.3 }} />
              </linearGradient>
            </defs>
            <motion.path
              d="M0,100 Q250,50 500,100 T1000,100 L1000,300 L0,300 Z"
              fill="url(#waveGradient)"
              animate={{
                d: [
                  "M0,100 Q250,50 500,100 T1000,100 L1000,300 L0,300 Z",
                  "M0,120 Q250,70 500,120 T1000,120 L1000,300 L0,300 Z",
                  "M0,100 Q250,50 500,100 T1000,100 L1000,300 L0,300 Z"
                ]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </svg>
        </div>
      </ParallaxLayer>
      
      {/* CSS Animation for twinkling effect */}
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