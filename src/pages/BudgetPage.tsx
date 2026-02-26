import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { useBudget } from '@/hooks/useBudget'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CATEGORY_COLORS } from '@/lib/utils'
import type { Expense } from '@/lib/types'

const EXPENSE_CATEGORIES: Expense['category'][] = [
  'accommodation', 'food', 'transport', 'activities', 'shopping', 'other',
]

export function BudgetPage() {
  const { id: tripId } = useParams<{ id: string }>()
  const { tripExpenses, budget, totalSpent, loadBudget, createExpense, deleteExpense, updateBudget } =
    useBudget(tripId!)
  const [showForm, setShowForm] = useState(false)
  const [showBudgetForm, setShowBudgetForm] = useState(false)
  const [form, setForm] = useState({ description: '', amount: '', category: 'other' as Expense['category'], date: new Date().toISOString().split('T')[0] })
  const [budgetInput, setBudgetInput] = useState('')
  const [currency, setCurrency] = useState('USD')

  useEffect(() => { loadBudget() }, [loadBudget])
  useEffect(() => {
    if (budget) { setBudgetInput(String(budget.totalBudget)); setCurrency(budget.currency) }
  }, [budget])

  const handleAddExpense = async () => {
    if (!form.description || !form.amount) return
    await createExpense({ ...form, amount: parseFloat(form.amount) })
    setForm({ description: '', amount: '', category: 'other', date: new Date().toISOString().split('T')[0] })
    setShowForm(false)
  }

  const handleSaveBudget = async () => {
    await updateBudget(parseFloat(budgetInput), currency)
    setShowBudgetForm(false)
  }

  const remaining = budget ? budget.totalBudget - totalSpent : null
  const pct = budget && budget.totalBudget > 0 ? Math.min((totalSpent / budget.totalBudget) * 100, 100) : 0

  // Group by category
  const byCategory = tripExpenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {})

  return (
    <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 pb-24 space-y-4">
      {/* Budget summary */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Budget Overview</span>
            <Button variant="ghost" size="sm" onClick={() => setShowBudgetForm(true)}>
              {budget ? 'Edit' : 'Set Budget'}
            </Button>
          </div>
          {budget ? (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Spent</span>
                <span className="font-semibold text-slate-200">
                  {budget.currency} {totalSpent.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Budget</span>
                <span className="text-slate-400">{budget.currency} {budget.totalBudget.toFixed(2)}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className={remaining && remaining < 0 ? 'text-red-400' : 'text-green-400'}>
                  {remaining && remaining < 0 ? 'Over by' : 'Remaining'}: {budget.currency} {Math.abs(remaining || 0).toFixed(2)}
                </span>
                <span className="text-slate-500">{pct.toFixed(0)}% used</span>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500">No budget set yet</p>
          )}
        </CardContent>
      </Card>

      {/* Category breakdown */}
      {Object.keys(byCategory).length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wide">By Category</p>
            <div className="space-y-2">
              {Object.entries(byCategory).map(([cat, amount]) => (
                <div key={cat} className="flex items-center justify-between">
                  <Badge className={CATEGORY_COLORS[cat]}>{cat}</Badge>
                  <span className="text-sm text-slate-300">{budget?.currency || '$'} {amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expenses list */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-300">Expenses ({tripExpenses.length})</h3>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {tripExpenses.length === 0 ? (
        <div className="text-center py-10 text-slate-500 text-sm">No expenses yet</div>
      ) : (
        <div className="space-y-2">
          {tripExpenses.map((exp) => (
            <div key={exp.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 group">
              <Badge className={`${CATEGORY_COLORS[exp.category]} flex-shrink-0`}>{exp.category}</Badge>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 truncate">{exp.description}</p>
                <p className="text-xs text-slate-500">{exp.date}</p>
              </div>
              <span className="font-semibold text-slate-200 text-sm flex-shrink-0">
                {budget?.currency || '$'} {exp.amount.toFixed(2)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 h-7 w-7 text-red-400"
                onClick={() => deleteExpense(exp.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add expense dialog */}
      <Dialog open={showForm} onOpenChange={(v) => !v && setShowForm(false)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Description *"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Amount *"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              />
              <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v as Expense['category'] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleAddExpense} disabled={!form.description || !form.amount}>Add</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Set budget dialog */}
      <Dialog open={showBudgetForm} onOpenChange={(v) => !v && setShowBudgetForm(false)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Set Budget</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'AUD', 'CAD', 'SGD'].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Total budget"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="col-span-2"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setShowBudgetForm(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSaveBudget} disabled={!budgetInput}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
