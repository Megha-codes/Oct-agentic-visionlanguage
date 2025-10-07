'use client'

import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ParallaxLayerProps {
  children: React.ReactNode
  speed?: number
  className?: string
  direction?: 'up' | 'down'
}

const ParallaxLayer: React.FC<ParallaxLayerProps> = ({ 
  children, 
  speed = 0.5, 
  className = "", 
  direction = 'up' 
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'up' 
      ? [`${speed * 100}%`, `-${speed * 100}%`] 
      : [`-${speed * 100}%`, `${speed * 100}%`]
  )

  return (
    <motion.div
      ref={ref}
      className={`absolute inset-0 will-change-transform ${className}`}
      style={{ y }}
    >
      {children}
    </motion.div>
  )
}

export default ParallaxLayer