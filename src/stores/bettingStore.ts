import { create } from 'zustand'

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
}

const PAYOUT_RATIOS = {
  single: 35, // 35 to 1 for single number
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
    const winningBet = state.bets.find(bet => bet.number === winningNumber)
    const totalWinnings = winningBet ? winningBet.amount * (PAYOUT_RATIOS.single + 1) : 0
    
    return {
      playerMoney: state.playerMoney + totalWinnings,
      bets: []
    }
  }),
  clearBets: () => set((state) => ({
    bets: [],
    playerMoney: state.playerMoney + state.bets.reduce((sum, bet) => sum + bet.amount, 0)
  }))
})) 