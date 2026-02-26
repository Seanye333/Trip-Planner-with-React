import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react'
import { usePacking } from '@/hooks/usePacking'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const DEFAULT_CATEGORIES = ['Clothing', 'Electronics', 'Documents', 'Toiletries', 'Medicines', 'Other']

export function PackingPage() {
  const { id: tripId } = useParams<{ id: string }>()
  const { items, loadPacking, addItem, toggleItem, deleteItem } = usePacking(tripId!)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Clothing')
  const [customCat, setCustomCat] = useState('')

  useEffect(() => { loadPacking() }, [loadPacking])

  const handleAdd = async () => {
    const cat = category === 'custom' ? customCat.trim() : category
    if (!name.trim() || !cat) return
    await addItem(cat, name.trim())
    setName('')
    setShowForm(false)
  }

  // Group by category
  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  const total = items.length
  const checked = items.filter((i) => i.checked).length
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0

  return (
    <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 pb-24 space-y-4">
      {/* Progress */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Packing Progress</span>
            <span className="text-sm text-slate-400">{checked}/{total} packed</span>
          </div>
          <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">{pct}% complete</p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-300">Packing List</h3>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" /> Add Item
        </Button>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-10 text-slate-500 text-sm">No items yet. Start adding things to pack!</div>
      ) : (
        Object.entries(grouped).map(([cat, catItems]) => (
          <Card key={cat}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="default">{cat}</Badge>
                <span className="text-xs text-slate-500">
                  {catItems.filter((i) => i.checked).length}/{catItems.length}
                </span>
              </div>
              <div className="space-y-2">
                {catItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 group">
                    <button
                      onClick={() => toggleItem(item.id, !item.checked)}
                      className="flex-shrink-0 text-slate-400 hover:text-green-400 transition-colors"
                    >
                      {item.checked ? (
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>
                    <span
                      className={`flex-1 text-sm transition-all ${
                        item.checked ? 'line-through text-slate-500' : 'text-slate-200'
                      }`}
                    >
                      {item.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 h-7 w-7 text-red-400"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* Add item dialog */}
      <Dialog open={showForm} onOpenChange={(v) => !v && setShowForm(false)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Packing Item</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Item name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DEFAULT_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
                <SelectItem value="custom">+ Custom category</SelectItem>
              </SelectContent>
            </Select>
            {category === 'custom' && (
              <Input
                placeholder="Category name"
                value={customCat}
                onChange={(e) => setCustomCat(e.target.value)}
              />
            )}
            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleAdd} disabled={!name.trim()}>Add</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
