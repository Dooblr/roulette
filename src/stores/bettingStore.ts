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
  single: 35, // 35 to 1 for single number
  color: 1,   // 1 to 1 for color bets
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
      // Remove bet if clicking again
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
    const winningBets = state.bets.filter(bet => bet.number === winningNumber)
    const totalWinnings = winningBets.reduce((sum, bet) => {
      const isColorBet = state.bets.some(b => 
        ROULETTE_NUMBERS.find(n => n.value === b.number)?.color === 
        ROULETTE_NUMBERS.find(n => n.value === winningNumber)?.color
      )
      const ratio = isColorBet ? PAYOUT_RATIOS.color : PAYOUT_RATIOS.single
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