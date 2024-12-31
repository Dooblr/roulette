import { motion } from 'framer-motion'
import { ROULETTE_NUMBERS } from '../../stores/gameStore'
import { useGameStore } from '../../stores/gameStore'
import './Lines.scss'

function Lines() {
  const { ballDirection, isSpinning, spinRotation } = useGameStore()

  return (
    <motion.div 
      className="lines"
      style={{ 
        transform: `rotate(${-spinRotation}deg)` // Negative for opposite direction
      }}
    >
      {ROULETTE_NUMBERS.map((num) => (
        <div 
          key={num.value}
          className="lines__segment"
          style={{
            transform: `rotate(${num.angle}deg)`,
          }}
        >
          <div 
            className="lines__line"
            style={{ backgroundColor: num.color }}
          />
          <div 
            className="lines__label"
            style={{ color: num.color === 'black' ? 'white' : num.color }}
          >
            {num.value === -1 ? '00' : num.value}
          </div>
        </div>
      ))}
    </motion.div>
  )
}

export default Lines 