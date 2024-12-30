import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useCollision } from './hooks/useCollision'
import './App.scss'

interface Vector2D {
  x: number
  y: number
}

function App() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [ballPosition, setBallPosition] = useState<Vector2D>({ x: 0, y: 0 })
  const [ballVelocity, setBallVelocity] = useState<Vector2D>({ x: 0, y: 0 })
  const ballRef = useRef<HTMLDivElement>(null)
  
  const handleCollision = useCollision({
    circleRadius: 150,
    ballRadius: 10,
    friction: 0.98,
    pullToCenter: 0.1
  })

  useEffect(() => {
    let frameId: number | null = null;
    let positionInterval: NodeJS.Timeout | null = null;

    if (isSpinning) {
      let currentAngle = 0;
      let currentVelocity = 15;
      let inwardPull = 0;

      const animate = () => {
        currentAngle += currentVelocity
        currentVelocity *= 0.997
        inwardPull += 0.0001

        const radius = Math.max(140 - inwardPull * 1000, 30)
        const pos: Vector2D = {
          x: Math.cos(currentAngle * Math.PI / 180) * radius,
          y: Math.sin(currentAngle * Math.PI / 180) * radius
        }

        const vel: Vector2D = {
          x: -Math.sin(currentAngle * Math.PI / 180) * currentVelocity,
          y: Math.cos(currentAngle * Math.PI / 180) * currentVelocity
        }

        const { pos: newPos, vel: newVel } = handleCollision(pos, vel)
        setBallPosition(newPos)
        setBallVelocity(newVel)

        if (currentVelocity > 0.1) {
          frameId = requestAnimationFrame(animate)
        } else {
          setIsSpinning(false)
        }
      }

      frameId = requestAnimationFrame(animate)

      // Optional: log position updates
      positionInterval = setInterval(() => {
        console.log(`Ball position: (${Math.round(ballPosition.x)}, ${Math.round(ballPosition.y)})`)
      }, 100)
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId)
      if (positionInterval) clearInterval(positionInterval)
    }
  }, [isSpinning, handleCollision])

  const startSpin = () => {
    setIsSpinning(true)
  }

  return (
    <div className="app-container">
      <div className="coordinate-system">
        <div className="circle">
          <motion.div 
            ref={ballRef}
            className="ball"
            style={{
              transform: `translate(${ballPosition.x}px, ${ballPosition.y}px)`
            }}
          />
          <div className="coordinates">
            ({Math.round(ballPosition.x)}, {Math.round(ballPosition.y)})
          </div>
        </div>
      </div>
      <button 
        className="spin-button"
        onClick={startSpin}
        disabled={isSpinning}
      >
        Spin
      </button>
    </div>
  )
}

export default App
