import { ROULETTE_NUMBERS } from '../../stores/gameStore'
import './Lines.scss'

function Lines() {
  return (
    <div className="lines">
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
    </div>
  )
}

export default Lines 