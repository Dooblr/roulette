import { useEffect, useState } from 'react'
import './Spinner.scss'
import { useGameStore } from '../../stores/gameStore'

function Spinner() {
  const { currentNumber } = useGameStore()
  const [rotation, setRotation] = useState(0)

  const getNumberFromAngle = (angle: number) => {
    // Normalize angle to 0-360
    const normalizedAngle = angle % 360
    // Each number takes up 360/37 degrees
    const segmentSize = 360 / 37
    // Calculate index in ROULETTE_NUMBERS
    const index = Math.floor(normalizedAngle / segmentSize)
    return ROULETTE_NUMBERS[index]
  }

  useEffect(() => {
    const handleSpin = () => {
      const spins = 4 // Reduced number of rotations
      const duration = 6000 // Increased duration to 6 seconds
      const startTime = performance.now()
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Ease out cubic function for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3)
        const currentRotation = spins * 360 * easeOut
        
        setRotation(currentRotation)
        
        // Calculate result when spin is complete
        if (progress === 1) {
          const finalNumber = getNumberFromAngle(currentRotation)
          setResult(finalNumber)
        }
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      setResult(null) // Clear previous result
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
        <div 
          className="spinner-result"
          style={{ color: currentNumber.color }}
        >
          Result: {currentNumber.value}
        </div>
      )}
      <div 
        className="spinner"
        style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}
      >
        <div className="spinner__inner"></div>
      </div>
    </>
  )
}

export default Spinner