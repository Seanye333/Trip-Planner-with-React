import { useCallback } from 'react'
import { useStore } from '@/lib/store'
import * as fb from '@/lib/firebase'
import type { PackingItem } from '@/lib/types'
import { generateId } from '@/lib/utils'

export function usePacking(tripId: string) {
  const { packingItems, addPackingItem, updatePackingItem, removePackingItem, setPackingItems } = useStore()
  const items = packingItems.filter((p) => p.tripId === tripId)

  const loadPacking = useCallback(async () => {
    // Local data already restored — only merge Firebase data
    try {
      const data = await fb.fetchPackingItems(tripId)
      if (data.length > 0) {
        const others = useStore.getState().packingItems.filter((p) => p.tripId !== tripId)
        setPackingItems([...others, ...data])
      }
    } catch (e) {
      console.warn('Firebase loadPacking failed, using local data:', e)
    }
  }, [tripId, setPackingItems])

  const addItem = useCallback(
    async (category: string, name: string) => {
      const id = generateId()
      const item: PackingItem = { id, tripId, category, name, checked: false }
      addPackingItem(item)
      fb.addPackingItem(item).catch((e) => console.warn('Firebase sync failed:', e))
    },
    [tripId, addPackingItem]
  )

  const toggleItem = useCallback(
    async (id: string, checked: boolean) => {
      updatePackingItem(id, { checked })
      fb.updatePackingItem(id, { checked }).catch((e) => console.warn('Firebase sync failed:', e))
    },
    [updatePackingItem]
  )

  const deleteItem = useCallback(
    async (id: string) => {
      removePackingItem(id)
      fb.deletePackingItem(id).catch((e) => console.warn('Firebase sync failed:', e))
    },
    [removePackingItem]
  )

  return { items, loadPacking, addItem, toggleItem, deleteItem }
}
