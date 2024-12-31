import { create } from 'zustand'

interface RouletteNumber {
  value: number
  color: 'red' | 'black' | 'green'
  angle: number  // Position in degrees
}

interface GameState {
  ballDirection: 1 | -1
  isSpinning: boolean
  currentNumber: RouletteNumber | null
  spinRotation: number
  setBallDirection: (direction: 1 | -1) => void
  setIsSpinning: (spinning: boolean) => void
  setCurrentNumber: (number: RouletteNumber | null) => void
  setSpinRotation: (rotation: number) => void
}

// Standard roulette wheel sequence with colors and positions
export const ROULETTE_NUMBERS: RouletteNumber[] = [
  { value: 0, color: 'green', angle: 95 },      // Center of segment (90-100)
  { value: 32, color: 'red', angle: 105 },      // Center of segment (100-110)
  { value: 15, color: 'black', angle: 115 },
  { value: 19, color: 'red', angle: 125 },
  { value: 4, color: 'black', angle: 135 },
  { value: 21, color: 'red', angle: 145 },
  { value: 2, color: 'black', angle: 155 },
  { value: 25, color: 'red', angle: 165 },
  { value: 17, color: 'black', angle: 175 },
  { value: 34, color: 'red', angle: 185 },
  { value: 6, color: 'black', angle: 195 },
  { value: 27, color: 'red', angle: 205 },
  { value: 13, color: 'black', angle: 215 },
  { value: 36, color: 'red', angle: 225 },
  { value: 11, color: 'black', angle: 235 },
  { value: 30, color: 'red', angle: 245 },
  { value: 8, color: 'black', angle: 255 },
  { value: 23, color: 'red', angle: 265 },
  { value: 10, color: 'black', angle: 275 },
  { value: 5, color: 'red', angle: 285 },
  { value: 24, color: 'black', angle: 295 },
  { value: 16, color: 'red', angle: 305 },
  { value: 33, color: 'black', angle: 315 },
  { value: 1, color: 'red', angle: 325 },
  { value: 20, color: 'black', angle: 335 },
  { value: 14, color: 'red', angle: 345 },
  { value: 31, color: 'black', angle: 355 },
  { value: 9, color: 'red', angle: 5 },
  { value: 22, color: 'black', angle: 15 },
  { value: 18, color: 'red', angle: 25 },
  { value: 29, color: 'black', angle: 35 },
  { value: 7, color: 'red', angle: 45 },
  { value: 28, color: 'black', angle: 55 },
  { value: 12, color: 'red', angle: 65 },
  { value: 35, color: 'black', angle: 75 },
  { value: 3, color: 'red', angle: 85 },
  { value: 26, color: 'black', angle: 95 }
]

export const useGameStore = create<GameState>((set) => ({
  ballDirection: 1,
  isSpinning: false,
  currentNumber: null,
  spinRotation: 0,
  setBallDirection: (direction) => set({ ballDirection: direction }),
  setIsSpinning: (spinning) => set({ isSpinning: spinning }),
  setCurrentNumber: (number) => set({ currentNumber: number }),
  setSpinRotation: (rotation) => set({ spinRotation: rotation })
}))

// Helper function to find the closest number to a given angle
export const findNumberByAngle = (angle: number): { 
  number: RouletteNumber, 
  next?: RouletteNumber, 
  isExactlyBetween: boolean 
} => {
  // Normalize angle to 0-360 and adjust for coordinate system
  const normalizedAngle = ((angle % 360) + 360) % 360
  
  // Find the closest number based on direct angle comparison
  const sortedNumbers = [...ROULETTE_NUMBERS].sort((a, b) => {
    const diffA = Math.abs(normalizedAngle - a.angle)
    const diffB = Math.abs(normalizedAngle - b.angle)
    return diffA - diffB
  })

  const closestNumber = sortedNumbers[0]
  const nextClosest = sortedNumbers[1]
  
  // Check if exactly between two numbers
  const angleDiff = Math.abs(normalizedAngle - closestNumber.angle)
  const isExactlyBetween = angleDiff > 4.5 // Half of segment width (9 degrees)

  return {
    number: closestNumber,
    next: isExactlyBetween ? nextClosest : undefined,
    isExactlyBetween
  }
} 