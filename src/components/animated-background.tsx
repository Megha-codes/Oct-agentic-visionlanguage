'use client'

import { useEffect, useRef } from 'react'

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.1)'
      ctx.lineWidth = 1

      const gridSize = 50
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    const drawWaves = () => {
      const waves = [
        { amplitude: 50, frequency: 0.01, speed: 0.02, color: 'rgba(147, 51, 234, 0.3)' },
        { amplitude: 30, frequency: 0.015, speed: 0.03, color: 'rgba(236, 72, 153, 0.3)' },
        { amplitude: 40, frequency: 0.008, speed: 0.025, color: 'rgba(59, 130, 246, 0.2)' },
      ]

      waves.forEach((wave) => {
        ctx.beginPath()
        ctx.strokeStyle = wave.color
        ctx.lineWidth = 2

        for (let x = 0; x < canvas.width; x += 5) {
          const y = canvas.height / 2 + 
                   Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude +
                   Math.sin(x * wave.frequency * 2 + time * wave.speed * 1.5) * wave.amplitude * 0.5
          
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.stroke()
      })
    }

    const drawCircles = () => {
      const circles = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, radius: 100, color: 'rgba(147, 51, 234, 0.1)' },
        { x: canvas.width * 0.8, y: canvas.height * 0.7, radius: 150, color: 'rgba(236, 72, 153, 0.1)' },
        { x: canvas.width * 0.5, y: canvas.height * 0.5, radius: 200, color: 'rgba(59, 130, 246, 0.05)' },
      ]

      circles.forEach((circle) => {
        const animatedRadius = circle.radius + Math.sin(time * 0.01) * 20
        
        ctx.beginPath()
        ctx.arc(circle.x, circle.y, animatedRadius, 0, Math.PI * 2)
        ctx.fillStyle = circle.color
        ctx.fill()
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)')
      gradient.addColorStop(0.5, 'rgba(30, 27, 75, 0.95)')
      gradient.addColorStop(1, 'rgba(67, 20, 85, 0.95)')
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drawGrid()
      drawWaves()
      drawCircles()

      time += 1
      animationId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    animate()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  )
}

export default AnimatedBackground