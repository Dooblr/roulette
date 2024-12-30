import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

interface RouletteWheelProps {
  onSpinComplete: (number: number) => void
  isSpinning: boolean
  setIsSpinning: (spinning: boolean) => void
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({
  onSpinComplete,
  isSpinning,
  setIsSpinning
}) => {
  const ballControls = useAnimation()
  
  const spinWheel = async () => {
    if (isSpinning) return
    
    setIsSpinning(true)
    const spins = 5 + Math.random() * 3 // Random number of spins between 5-8
    const duration = 4 + Math.random() * 2 // Random duration between 4-6 seconds
    
    // Calculate final position
    const finalNumber = Math.floor(Math.random() * 37)
    const finalAngle = (finalNumber / 37) * 360
    
    // Spin the ball
    await ballControls.start({
      rotate: [0, 360 * spins + finalAngle],
      transition: {
        duration: duration,
        ease: [0.32, 0, 0.67, 1], // Custom easing for realistic deceleration
      }
    })
    
    setIsSpinning(false)
    onSpinComplete(finalNumber)
  }
  
  useEffect(() => {
    if (isSpinning) {
      spinWheel()
    }
  }, [isSpinning])

  return (
    <div className="roulette-wheel">
      <motion.div 
        className="roulette-wheel__ball"
        animate={ballControls}
        initial={{ rotate: 0 }}
      />
    </div>
  )
}

export default RouletteWheel 