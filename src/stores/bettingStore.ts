import { create } from 'zustand'
import { ROULETTE_NUMBERS } from './gameStore'

interface Bet {
  number: number
  amount: number
}

interface BettingState {
  playerMoney: number
  selectedBetAmount: number
  bets: Bet[]
  setPlayerMoney: (amount: number) => void
  setBetAmount: (amount: number) => void
  placeBet: (number: number) => void
  removeBet: (number: number) => void
  handleWin: (winningNumber: number) => void
  clearBets: () => void
  placeBetOnColor: (color: 'red' | 'black') => void
}

const PAYOUT_RATIOS = {
  single: 35,    // Single number (35:1)
  double: 17,    // 2 numbers (17:1)
  triple: 11,    // 3 numbers (11:1)
  quad: 8,       // 4 numbers (8:1)
  five: 6.5,     // 5 numbers (6.5:1)
  six: 5,        // 6 numbers (5:1)
  dozen: 2,      // 12 numbers (2:1)
  half: 1,       // 18 numbers (1:1)
  color: 1       // Red/Black (1:1)
}

const getBetType = (betNumbers: number[]): keyof typeof PAYOUT_RATIOS => {
  const count = betNumbers.length
  
  switch (count) {
    case 1:
      return 'single'
    case 2:
      return 'double'
    case 3:
      return 'triple'
    case 4:
      return 'quad'
    case 5:
      return 'five'
    case 6:
      return 'six'
    case 12:
      return 'dozen'
    case 18:
      return 'half'
    default:
      if (isColorBet(betNumbers)) return 'color'
      return 'single' // fallback
  }
}

const isColorBet = (numbers: number[]): boolean => {
  if (numbers.length === 0) return false
  const firstNumber = numbers[0]
  const firstColor = ROULETTE_NUMBERS.find(n => n.value === firstNumber)?.color
  return numbers.every(num => 
    ROULETTE_NUMBERS.find(n => n.value === num)?.color === firstColor
  )
}

export const useBettingStore = create<BettingState>((set, get) => ({
  playerMoney: 1000,
  selectedBetAmount: 1,
  bets: [],
  setPlayerMoney: (amount) => set({ playerMoney: amount }),
  setBetAmount: (amount) => set({ selectedBetAmount: amount }),
  placeBet: (number) => set((state) => {
    const existingBet = state.bets.find(bet => bet.number === number)
    if (existingBet) {
      return {
        bets: state.bets.filter(bet => bet.number !== number),
        playerMoney: state.playerMoney + existingBet.amount
      }
    }
    if (state.selectedBetAmount > state.playerMoney) return state
    
    return {
      bets: [...state.bets, { number, amount: state.selectedBetAmount }],
      playerMoney: state.playerMoney - state.selectedBetAmount
    }
  }),
  removeBet: (number) => set((state) => {
    const bet = state.bets.find(b => b.number === number)
    if (!bet) return state
    return {
      bets: state.bets.filter(b => b.number !== number),
      playerMoney: state.playerMoney + bet.amount
    }
  }),
  handleWin: (winningNumber) => set((state) => {
    // Group bets by their type
    const betNumbers = state.bets.map(bet => bet.number)
    const betType = getBetType(betNumbers)
    const ratio = PAYOUT_RATIOS[betType]

    // Calculate winnings for matching bets
    const winningBets = state.bets.filter(bet => bet.number === winningNumber)
    const totalWinnings = winningBets.reduce((sum, bet) => {
      return sum + (bet.amount * (ratio + 1))
    }, 0)
    
    return {
      playerMoney: state.playerMoney + totalWinnings,
      bets: []
    }
  }),
  clearBets: () => set((state) => ({
    bets: [],
    playerMoney: state.playerMoney + state.bets.reduce((sum, bet) => sum + bet.amount, 0)
  })),
  placeBetOnColor: (color) => set((state) => {
    const numbersOfColor = ROULETTE_NUMBERS.filter(n => n.color === color)
    const totalBet = state.selectedBetAmount * numbersOfColor.length
    
    if (totalBet > state.playerMoney) return state
    
    const newBets = numbersOfColor.map(n => ({
      number: n.value,
      amount: state.selectedBetAmount
    }))
    
    return {
      bets: [...state.bets, ...newBets],
      playerMoney: state.playerMoney - totalBet
    }
  })
})) 