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
  setBallDirection: (direction: 1 | -1) => void
  setIsSpinning: (spinning: boolean) => void
  setCurrentNumber: (number: RouletteNumber | null) => void
}

// Standard roulette wheel sequence with colors and positions
export const ROULETTE_NUMBERS: RouletteNumber[] = [
  { value: 0, color: 'green', angle: 0 },
  { value: 32, color: 'red', angle: 9.73 },
  { value: 15, color: 'black', angle: 19.46 },
  { value: 19, color: 'red', angle: 29.19 },
  { value: 4, color: 'black', angle: 38.92 },
  { value: 21, color: 'red', angle: 48.65 },
  { value: 2, color: 'black', angle: 58.38 },
  { value: 25, color: 'red', angle: 68.11 },
  { value: 17, color: 'black', angle: 77.84 },
  { value: 34, color: 'red', angle: 87.57 },
  { value: 6, color: 'black', angle: 97.3 },
  { value: 27, color: 'red', angle: 107.03 },
  { value: 13, color: 'black', angle: 116.76 },
  { value: 36, color: 'red', angle: 126.49 },
  { value: 11, color: 'black', angle: 136.22 },
  { value: 30, color: 'red', angle: 145.95 },
  { value: 8, color: 'black', angle: 155.68 },
  { value: 23, color: 'red', angle: 165.41 },
  { value: 10, color: 'black', angle: 175.14 },
  { value: 5, color: 'red', angle: 184.87 },
  { value: 24, color: 'black', angle: 194.6 },
  { value: 16, color: 'red', angle: 204.33 },
  { value: 33, color: 'black', angle: 214.06 },
  { value: 1, color: 'red', angle: 223.79 },
  { value: 20, color: 'black', angle: 233.52 },
  { value: 14, color: 'red', angle: 243.25 },
  { value: 31, color: 'black', angle: 252.98 },
  { value: 9, color: 'red', angle: 262.71 },
  { value: 22, color: 'black', angle: 272.44 },
  { value: 18, color: 'red', angle: 282.17 },
  { value: 29, color: 'black', angle: 291.9 },
  { value: 7, color: 'red', angle: 301.63 },
  { value: 28, color: 'black', angle: 311.36 },
  { value: 12, color: 'red', angle: 321.09 },
  { value: 35, color: 'black', angle: 330.82 },
  { value: 3, color: 'red', angle: 340.55 },
  { value: 26, color: 'black', angle: 350.28 }
]

export const useGameStore = create<GameState>((set) => ({
  ballDirection: 1,
  isSpinning: false,
  currentNumber: null,
  setBallDirection: (direction) => set({ ballDirection: direction }),
  setIsSpinning: (spinning) => set({ isSpinning: spinning }),
  setCurrentNumber: (number) => set({ currentNumber: number })
}))

// Helper function to find the closest number to a given angle
export const findNumberByAngle = (angle: number): RouletteNumber => {
  // Normalize angle to 0-360
  const normalizedAngle = ((angle % 360) + 360) % 360
  
  // Find the closest number based on angle
  return ROULETTE_NUMBERS.reduce((closest, current) => {
    const currentDiff = Math.abs(normalizedAngle - current.angle)
    const closestDiff = Math.abs(normalizedAngle - closest.angle)
    return currentDiff < closestDiff ? current : closest
  }, ROULETTE_NUMBERS[0])
} 