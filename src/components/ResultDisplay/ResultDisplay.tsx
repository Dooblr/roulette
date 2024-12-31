import { useGameStore } from '../../stores/gameStore'
import './ResultDisplay.scss'

function ResultDisplay() {
  const { currentNumber } = useGameStore()

  if (!currentNumber) return null

  return (
    <div className="result-display">
      <div className="result-display__container">
        <div 
          className="result-display__number"
          style={{ color: currentNumber.color === 'black' ? 'white' : currentNumber.color }}
        >
          {currentNumber.value === -1 ? '00' : currentNumber.value}
        </div>
        <div 
          className="result-display__color"
          style={{ color: currentNumber.color === 'black' ? 'white' : currentNumber.color }}
        >
          {currentNumber.color.toUpperCase()}
        </div>
      </div>
    </div>
  )
}

export default ResultDisplay 