import { useCallback } from 'react'
import { useStore } from '@/lib/store'
import * as fb from '@/lib/firebase'
import type { Expense, TripBudget } from '@/lib/types'
import { generateId } from '@/lib/utils'

export function useBudget(tripId: string) {
  const { expenses, addExpense, removeExpense, setExpenses, budgets, setBudget } = useStore()
  const tripExpenses = expenses.filter((e) => e.tripId === tripId)
  const budget = budgets[tripId]
  const totalSpent = tripExpenses.reduce((sum, e) => sum + e.amount, 0)

  const loadBudget = useCallback(async () => {
    // Local data already restored — only merge Firebase data
    try {
      const [exps, bud] = await Promise.all([fb.fetchExpenses(tripId), fb.fetchBudget(tripId)])
      if (exps.length > 0) {
        const others = useStore.getState().expenses.filter((e) => e.tripId !== tripId)
        setExpenses([...others, ...exps])
      }
      if (bud) setBudget(tripId, bud)
    } catch (e) {
      console.warn('Firebase loadBudget failed, using local data:', e)
    }
  }, [tripId, setExpenses, setBudget])

  const createExpense = useCallback(
    async (data: Omit<Expense, 'id' | 'tripId'>) => {
      const id = generateId()
      const expense: Expense = { ...data, id, tripId }
      addExpense(expense)
      fb.addExpense(expense).catch((e) => console.warn('Firebase sync failed:', e))
    },
    [tripId, addExpense]
  )

  const deleteExpense = useCallback(
    async (id: string) => {
      removeExpense(id)
      fb.deleteExpense(id).catch((e) => console.warn('Firebase sync failed:', e))
    },
    [removeExpense]
  )

  const updateBudget = useCallback(
    async (total: number, currency: string) => {
      const bud: TripBudget = { tripId, totalBudget: total, currency }
      setBudget(tripId, bud)
      fb.saveBudget(bud).catch((e) => console.warn('Firebase sync failed:', e))
    },
    [tripId, setBudget]
  )

  return { tripExpenses, budget, totalSpent, loadBudget, createExpense, deleteExpense, updateBudget }
}
