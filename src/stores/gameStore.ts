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
  { value: 0, color: 'green', angle: 0 },      // Green 0
  { value: -1, color: 'green', angle: 180 },   // Green 00 (using -1 to represent 00)
  { value: 32, color: 'red', angle: 10 },
  { value: 15, color: 'black', angle: 20 },
  { value: 19, color: 'red', angle: 30 },
  { value: 4, color: 'black', angle: 40 },
  { value: 21, color: 'red', angle: 50 },
  { value: 2, color: 'black', angle: 60 },
  { value: 25, color: 'red', angle: 70 },
  { value: 17, color: 'black', angle: 80 },
  { value: 34, color: 'red', angle: 90 },
  { value: 6, color: 'black', angle: 100 },
  { value: 27, color: 'red', angle: 110 },
  { value: 13, color: 'black', angle: 120 },
  { value: 36, color: 'red', angle: 130 },
  { value: 11, color: 'black', angle: 140 },
  { value: 30, color: 'red', angle: 150 },
  { value: 8, color: 'black', angle: 160 },
  { value: 23, color: 'red', angle: 170 },
  { value: 10, color: 'black', angle: 190 },
  { value: 5, color: 'red', angle: 200 },
  { value: 24, color: 'black', angle: 210 },
  { value: 16, color: 'red', angle: 220 },
  { value: 33, color: 'black', angle: 230 },
  { value: 1, color: 'red', angle: 240 },
  { value: 20, color: 'black', angle: 250 },
  { value: 14, color: 'red', angle: 260 },
  { value: 31, color: 'black', angle: 270 },
  { value: 9, color: 'red', angle: 280 },
  { value: 22, color: 'black', angle: 290 },
  { value: 18, color: 'red', angle: 300 },
  { value: 29, color: 'black', angle: 310 },
  { value: 7, color: 'red', angle: 320 },
  { value: 28, color: 'black', angle: 330 },
  { value: 12, color: 'red', angle: 340 },
  { value: 35, color: 'black', angle: 350 }
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