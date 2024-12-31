import { ROULETTE_NUMBERS } from '../../stores/gameStore'
import { useBettingStore } from '../../stores/bettingStore'
import './BettingGrid.scss'

const BET_AMOUNTS = [1, 5, 10, 20, 50, 100]

function BettingGrid() {
  const { 
    playerMoney, 
    selectedBetAmount, 
    setBetAmount, 
    placeBet,
    clearBets,
    bets 
  } = useBettingStore()

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="betting-grid">
      <div className="betting-grid__money">
        Balance: {formatMoney(playerMoney)}
      </div>
      <div className="betting-grid__controls">
        <div className="betting-grid__amounts">
          {BET_AMOUNTS.map(amount => (
            <button
              key={amount}
              className={`betting-grid__amount-btn ${selectedBetAmount === amount ? 'betting-grid__amount-btn--selected' : ''}`}
              onClick={() => setBetAmount(amount)}
            >
              ${amount}
            </button>
          ))}
        </div>
        <button 
          className="betting-grid__clear-btn"
          onClick={clearBets}
          disabled={bets.length === 0}
        >
          Clear Bets
        </button>
      </div>
      <div className="betting-grid__container">
        {ROULETTE_NUMBERS
          .filter(num => num.value >= 0)
          .sort((a, b) => a.value - b.value)
          .map((num) => {
            const currentBet = bets.find(bet => bet.number === num.value)
            return (
              <div
                key={num.value}
                className={`betting-grid__cell ${currentBet ? 'betting-grid__cell--selected' : ''}`}
                style={{ 
                  backgroundColor: num.color,
                  color: num.color === 'black' ? 'white' : 'black'
                }}
                onClick={() => placeBet(num.value)}
              >
                <span>{num.value}</span>
                {currentBet && (
                  <div className="betting-grid__coin">
                    ${currentBet.amount}
                  </div>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default BettingGrid 