import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import './Rim.scss'

interface RimProps {
  onSpinComplete: (number: number) => void
  isSpinning: boolean
  setIsSpinning: (spinning: boolean) => void
}

const Rim: React.FC<RimProps> = ({
  onSpinComplete,
  isSpinning,
  setIsSpinning
}) => {
  const ballControls = useAnimation()
  const rimControls = useAnimation()
  
  const spinWheel = async () => {
    if (isSpinning) return
    
    setIsSpinning(true)
    const spins = 5 + Math.random() * 3
    const duration = 4 + Math.random() * 2
    
    const finalNumber = Math.floor(Math.random() * 37)
    const finalAngle = (finalNumber / 37) * 360
    
    await Promise.all([
      rimControls.start({
        rotate: 360 * spins,
        transition: {
          duration: duration,
          ease: "linear"
        }
      }),
      ballControls.start({
        rotate: [0, 360 * spins + finalAngle],
        transition: {
          duration: duration,
          ease: [0.32, 0, 0.67, 1],
        }
      })
    ])
    
    setIsSpinning(false)
    onSpinComplete(finalNumber)
  }
  
  useEffect(() => {
    if (isSpinning) {
      spinWheel()
    }
  }, [isSpinning])

  return (
    <div className="rim">
      <motion.div 
        className="rim__spinner"
        animate={rimControls}
      >
        <div className="rim__background" />
      </motion.div>
      <motion.div 
        className="rim__ball"
        animate={ballControls}
        initial={{ rotate: 0 }}
      />
    </div>
  )
}

export default Rim 