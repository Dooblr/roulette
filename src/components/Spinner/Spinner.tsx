import { useEffect, useState } from 'react'
import './Spinner.scss'

// Roulette wheel number sequence
const ROULETTE_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
  24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
]

function Spinner() {
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<number | null>(null)

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
      {result !== null && (
        <div className="spinner-result">
          Result: {result}
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