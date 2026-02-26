import { useCallback } from 'react'
import { useStore } from '@/lib/store'
import * as fb from '@/lib/firebase'
import type { PackingItem } from '@/lib/types'

export function usePacking(tripId: string) {
  const { packingItems, addPackingItem, updatePackingItem, removePackingItem, setPackingItems } = useStore()
  const items = packingItems.filter((p) => p.tripId === tripId)

  const loadPacking = useCallback(async () => {
    try {
      const data = await fb.fetchPackingItems(tripId)
      const others = useStore.getState().packingItems.filter((p) => p.tripId !== tripId)
      setPackingItems([...others, ...data])
    } catch (e) {
      console.error('loadPacking:', e)
    }
  }, [tripId, setPackingItems])

  const addItem = useCallback(
    async (category: string, name: string) => {
      const item: Omit<PackingItem, 'id'> = { tripId, category, name, checked: false }
      const id = await fb.addPackingItem(item)
      addPackingItem({ id, ...item })
    },
    [tripId, addPackingItem]
  )

  const toggleItem = useCallback(
    async (id: string, checked: boolean) => {
      await fb.updatePackingItem(id, { checked })
      updatePackingItem(id, { checked })
    },
    [updatePackingItem]
  )

  const deleteItem = useCallback(
    async (id: string) => {
      await fb.deletePackingItem(id)
      removePackingItem(id)
    },
    [removePackingItem]
  )

  return { items, loadPacking, addItem, toggleItem, deleteItem }
}
