import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useCollision } from './hooks/useCollision'
import './App.scss'
import Spinner from './components/Spinner/Spinner'
import { useGameStore, findNumberByAngle } from './stores/gameStore'

interface Vector2D {
  x: number
  y: number
}

function App() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [ballPosition, setBallPosition] = useState<Vector2D>({ x: 0, y: 0 })
  const [ballVelocity, setBallVelocity] = useState<Vector2D>({ x: 0, y: 0 })
  const ballRef = useRef<HTMLDivElement>(null)
  
  const circleRadius = 375 / 2
  const stopRadius = circleRadius * 0.6
  const startRadius = circleRadius - 12.5
  const initialRevolutions = 5
  const chaosLevel = 0.15

  // Randomize initial velocity between 12-18
  const getInitialVelocity = () => 15 + (Math.random() * 6 - 3)
  
  const handleCollision = useCollision({
    circleRadius,
    ballRadius: 10,
    friction: 0.98,
    pullToCenter: 0.1
  })

  const addChaos = (value: number, maxDeviation: number) => {
    const randomFactor = (Math.random() * 2 - 1) * chaosLevel
    return value * (1 + randomFactor * maxDeviation)
  }

  const { setCurrentNumber } = useGameStore()

  useEffect(() => {
    let frameId: number | null = null;

    if (isSpinning) {
      let currentAngle = 0;
      let baseVelocity = getInitialVelocity();
      let currentVelocity = baseVelocity;
      let currentRadius = startRadius;
      let revolutionCount = 0;
      let inwardPhase = false;
      let lastUpdateTime = performance.now();
      let spinDirection = Math.random() > 0.5 ? 1 : -1; // Random direction

      const animate = (currentTime: number) => {
        const deltaTime = (currentTime - lastUpdateTime) / 16.67;
        lastUpdateTime = currentTime;

        if (!inwardPhase) {
          const previousRevs = Math.floor(revolutionCount);
          revolutionCount = Math.abs(currentAngle / 360);
          
          // More pronounced velocity variations during edge phase
          currentVelocity = addChaos(baseVelocity, 0.3) * spinDirection;
          
          if (Math.floor(revolutionCount) > previousRevs && revolutionCount >= initialRevolutions) {
            inwardPhase = true;
          }
        }

        if (inwardPhase) {
          const progress = Math.max(0, Math.min(1, 
            (startRadius - currentRadius) / (startRadius - stopRadius)
          ));

          currentVelocity = addChaos(baseVelocity * (1 - Math.pow(progress, 2)), 0.3) * spinDirection;
          
          const baseRadiusDecrease = (startRadius - stopRadius) * 0.005;
          const radiusDecrease = addChaos(baseRadiusDecrease, 0.4) * deltaTime;
          currentRadius = Math.max(stopRadius, currentRadius - radiusDecrease);
        }
        
        const angleIncrement = addChaos(currentVelocity, 0.15) * deltaTime;
        currentAngle += angleIncrement;

        const radiusVariation = addChaos(currentRadius, 0.05);
        const pos: Vector2D = {
          x: Math.cos(currentAngle * Math.PI / 180) * radiusVariation,
          y: Math.sin(currentAngle * Math.PI / 180) * radiusVariation
        }

        const vel: Vector2D = {
          x: -Math.sin(currentAngle * Math.PI / 180) * currentVelocity,
          y: Math.cos(currentAngle * Math.PI / 180) * currentVelocity
        }

        const { pos: newPos, vel: newVel } = handleCollision(pos, vel)
        setBallPosition(newPos)
        setBallVelocity(newVel)

        if (inwardPhase && currentRadius <= stopRadius && Math.abs(currentVelocity) < 0.1) {
          const normalizedAngle = ((-currentAngle % 360) + 360) % 360
          const finalNumber = findNumberByAngle(normalizedAngle)
          setCurrentNumber(finalNumber)
          setIsSpinning(false)
          return
        }

        frameId = requestAnimationFrame(animate)
      }

      frameId = requestAnimationFrame(animate)
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [isSpinning, handleCollision, stopRadius, chaosLevel, setCurrentNumber])

  const startSpin = () => {
    setBallPosition({ 
      x: startRadius * Math.cos(0), 
      y: startRadius * Math.sin(0)
    })
    setIsSpinning(true)
  }

  return (
    <div className="app-container">
      <Spinner />
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
