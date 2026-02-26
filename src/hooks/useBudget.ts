import { useCallback } from 'react'
import { useStore } from '@/lib/store'
import * as fb from '@/lib/firebase'
import type { Expense, TripBudget } from '@/lib/types'

export function useBudget(tripId: string) {
  const { expenses, addExpense, removeExpense, setExpenses, budgets, setBudget } = useStore()
  const tripExpenses = expenses.filter((e) => e.tripId === tripId)
  const budget = budgets[tripId]
  const totalSpent = tripExpenses.reduce((sum, e) => sum + e.amount, 0)

  const loadBudget = useCallback(async () => {
    try {
      const [exps, bud] = await Promise.all([fb.fetchExpenses(tripId), fb.fetchBudget(tripId)])
      const others = useStore.getState().expenses.filter((e) => e.tripId !== tripId)
      setExpenses([...others, ...exps])
      if (bud) setBudget(tripId, bud)
    } catch (e) {
      console.error('loadBudget:', e)
    }
  }, [tripId, setExpenses, setBudget])

  const createExpense = useCallback(
    async (data: Omit<Expense, 'id' | 'tripId'>) => {
      const expense: Omit<Expense, 'id'> = { ...data, tripId }
      const id = await fb.addExpense(expense)
      addExpense({ id, ...expense })
    },
    [tripId, addExpense]
  )

  const deleteExpense = useCallback(
    async (id: string) => {
      await fb.deleteExpense(id)
      removeExpense(id)
    },
    [removeExpense]
  )

  const updateBudget = useCallback(
    async (total: number, currency: string) => {
      const bud: TripBudget = { tripId, totalBudget: total, currency }
      await fb.saveBudget(bud)
      setBudget(tripId, bud)
    },
    [tripId, setBudget]
  )

  return { tripExpenses, budget, totalSpent, loadBudget, createExpense, deleteExpense, updateBudget }
}
