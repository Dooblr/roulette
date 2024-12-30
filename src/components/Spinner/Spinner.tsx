import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../stores/gameStore'
import './Spinner.scss'

function Spinner() {
  const { currentNumber } = useGameStore()
  const [rotation, setRotation] = useState(0)
  const [finalAngle, setFinalAngle] = useState<number | null>(null)

  useEffect(() => {
    const handleSpin = () => {
      const spins = 4
      const duration = 6000
      const startTime = performance.now()
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        const easeOut = 1 - Math.pow(1 - progress, 3)
        const currentRotation = spins * 360 * easeOut
        
        setRotation(currentRotation)
        
        if (progress === 1) {
          setFinalAngle(currentRotation % 360)
        }
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      setFinalAngle(null)
      requestAnimationFrame(animate)
    }

    const spinButton = document.querySelector('.spin-button')
    if (spinButton) {
      spinButton.addEventListener('click', handleSpin)
    }

    return () => {
      if (spinButton) {
        spinButton.removeEventListener('click', handleSpin)
      }
    }
  }, [])

  return (
    <>
      {currentNumber && (
        <p 
          className="spinner-result"
          style={{ color: currentNumber.color }}
        >
          {currentNumber.value} 
          {currentNumber.color.toUpperCase()}
        </p>
      )}
      <div 
        className="spinner"
        style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}
      >
        <div className="spinner__inner" />
        {finalAngle !== null && (
          <div 
            className="spinner__indicator"
            style={{ 
              transform: `rotate(${finalAngle}deg)`,
              backgroundColor: 'blue',
              position: 'absolute',
              width: '2px',
              height: '50%',
              left: 'calc(50% - 1px)',
              top: '0',
              transformOrigin: 'bottom center',
              opacity: 0.7,
              zIndex: 3
            }}
          />
        )}
      </div>
    </>
  )
}

export default Spinner