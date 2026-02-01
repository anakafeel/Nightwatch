"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export interface SnowBackgroundProps {
  className?: string
  children?: React.ReactNode
  /** Base number of snowflakes */
  count?: number
  /** Snowfall intensity multiplier */
  intensity?: number
  /** Wind strength (negative = left, positive = right) */
  wind?: number
  /** Snowflake color */
  color?: string
  /** Speed multiplier */
  speed?: number
}

interface Snowflake {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  wobbleOffset: number
  wobbleSpeed: number
  rotation: number
  rotationSpeed: number
  layer: number
}

export function SnowBackground({
  className,
  children,
  count = 150,
  intensity = 1,
  wind = 0.3,
  color = "rgba(255, 255, 255, 0.9)",
  speed = 1,
}: SnowBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = container.getBoundingClientRect()
    let width = rect.width
    let height = rect.height
    canvas.width = width
    canvas.height = height

    let animationId: number
    let tick = 0
    const totalFlakes = Math.floor(count * intensity)

    // Layer configurations: [speed, minSize, maxSize, opacity]
    const layers = [
      { speed: 0.3, minSize: 1, maxSize: 2.5, opacity: 0.4 }, // far
      { speed: 0.6, minSize: 2, maxSize: 4, opacity: 0.6 }, // mid
      { speed: 1, minSize: 3, maxSize: 6, opacity: 0.9 }, // close
    ]

    // Create snowflakes
    const createSnowflake = (layer: number, startFromTop = false): Snowflake => {
      const config = layers[layer]
      return {
        x: Math.random() * (width + 100) - 50,
        y: startFromTop ? -10 - Math.random() * 100 : Math.random() * height,
        size: config.minSize + Math.random() * (config.maxSize - config.minSize),
        speed: config.speed * (0.8 + Math.random() * 0.4),
        opacity: config.opacity * (0.8 + Math.random() * 0.2),
        wobbleOffset: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.02,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        layer,
      }
    }

    const snowflakes: Snowflake[] = []
    for (let i = 0; i < totalFlakes; i++) {
      // Distribute across layers: 40% far, 35% mid, 25% close
      const layer = i < totalFlakes * 0.4 ? 0 : i < totalFlakes * 0.75 ? 1 : 2
      snowflakes.push(createSnowflake(layer))
    }

    // Sort by layer for proper depth rendering
    snowflakes.sort((a, b) => a.layer - b.layer)

    // Resize handler
    const handleResize = () => {
      const rect = container.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width
      canvas.height = height
    }

    const ro = new ResizeObserver(handleResize)
    ro.observe(container)

    // Animation
    const animate = () => {
      tick++
      ctx.clearRect(0, 0, width, height)

      for (const flake of snowflakes) {
        // Vertical movement
        flake.y += flake.speed * speed * 1.5

        // Horizontal wobble + wind
        const wobble = Math.sin(tick * flake.wobbleSpeed + flake.wobbleOffset) * 0.5
        flake.x += wobble + wind * flake.speed * speed

        // Rotation
        flake.rotation += flake.rotationSpeed * speed

        // Reset if off screen
        if (flake.y > height + 20) {
          flake.y = -10 - Math.random() * 50
          flake.x = Math.random() * (width + 100) - 50
        }
        if (flake.x < -50) flake.x = width + 50
        if (flake.x > width + 50) flake.x = -50

        // Draw snowflake
        ctx.save()
        ctx.translate(flake.x, flake.y)
        ctx.rotate(flake.rotation)

        // Soft glow
        ctx.shadowColor = "rgba(255, 255, 255, 0.5)"
        ctx.shadowBlur = flake.size * 2

        // Main flake body
        ctx.globalAlpha = flake.opacity
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(0, 0, flake.size, 0, Math.PI * 2)
        ctx.fill()

        // Subtle inner highlight
        ctx.globalAlpha = flake.opacity * 0.5
        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.arc(-flake.size * 0.2, -flake.size * 0.2, flake.size * 0.4, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      }

      ctx.shadowBlur = 0
      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
      ro.disconnect()
    }
  }, [count, intensity, wind, color, speed])

  return (
    <div
      ref={containerRef}
      className={cn("fixed inset-0 overflow-hidden", className)}
      style={{
        background: "linear-gradient(to bottom, #1a2a3a 0%, #2d3e50 40%, #3a4a5c 100%)",
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Subtle ambient light */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(200, 220, 255, 0.15) 0%, transparent 50%)",
        }}
      />

      {/* Ground fog effect */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4"
        style={{
          background: "linear-gradient(to top, rgba(200, 210, 230, 0.2) 0%, transparent 100%)",
        }}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(15,25,35,0.7) 100%)",
        }}
      />

      {/* Content layer */}
      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  )
}

export default function SnowBackgroundDemo() {
  return <SnowBackground />
}
