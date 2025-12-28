import { useState, useCallback, useRef } from 'react'
import type { MediaItem, MediaType, TierType } from '../types'

export interface TierAssignment {
  item: MediaItem
  tier: TierType
}

export function useGame(getRandomThree: (type: MediaType) => MediaItem[]) {
  const [currentCategory, setCurrentCategory] = useState<MediaType | null>(null)
  const [currentItems, setCurrentItems] = useState<MediaItem[]>([])
  const [tierList, setTierList] = useState<Record<TierType, MediaItem[]>>({
    forever: [],
    once: [],
    delete: [],
  })
  const [roundComplete, setRoundComplete] = useState(false)
  const usedItemIds = useRef<Set<string>>(new Set())

  const getNewItems = useCallback(
    (category: MediaType): MediaItem[] => {
      let attempts = 0
      while (attempts < 10) {
        const items = getRandomThree(category)
        const newItems = items.filter((item) => !usedItemIds.current.has(item.id))
        if (newItems.length === 3) {
          newItems.forEach((item) => usedItemIds.current.add(item.id))
          return newItems
        }
        attempts++
      }
      const items = getRandomThree(category)
      items.forEach((item) => usedItemIds.current.add(item.id))
      return items
    },
    [getRandomThree]
  )

  const startRound = useCallback(
    (category: MediaType) => {
      const items = getNewItems(category)
      setCurrentCategory(category)
      setCurrentItems(items)
      setRoundComplete(false)
    },
    [getNewItems]
  )

  const assignToTier = useCallback((item: MediaItem, tier: TierType) => {
    setTierList((prev) => ({
      ...prev,
      [tier]: [...prev[tier], item],
    }))
    setCurrentItems((prev) => {
      const newItems = prev.filter((i) => i.id !== item.id)
      if (newItems.length === 0) {
        setRoundComplete(true)
      }
      return newItems
    })
  }, [])

  const removeFromTier = useCallback((item: MediaItem, tier: TierType) => {
    setTierList((prev) => ({
      ...prev,
      [tier]: prev[tier].filter((i) => i.id !== item.id),
    }))
    setCurrentItems((prev) => [...prev, item])
    setRoundComplete(false)
  }, [])

  const moveToTier = useCallback((item: MediaItem, fromTier: TierType, toTier: TierType) => {
    if (fromTier === toTier) return
    setTierList((prev) => ({
      ...prev,
      [fromTier]: prev[fromTier].filter((i) => i.id !== item.id),
      [toTier]: [...prev[toTier], item],
    }))
  }, [])

  const nextRound = useCallback(() => {
    if (!currentCategory) return
    const items = getNewItems(currentCategory)
    setCurrentItems(items)
    setRoundComplete(false)
  }, [currentCategory, getNewItems])

  const changeCategory = useCallback(() => {
    setCurrentCategory(null)
    setCurrentItems([])
    setRoundComplete(false)
  }, [])

  const reset = useCallback(() => {
    setCurrentCategory(null)
    setCurrentItems([])
    setTierList({ forever: [], once: [], delete: [] })
    setRoundComplete(false)
    usedItemIds.current.clear()
  }, [])

  const isSelectingCategory = currentCategory === null
  const isPicking = currentCategory !== null && currentItems.length > 0
  const isRoundComplete = roundComplete

  return {
    currentCategory,
    currentItems,
    tierList,
    isSelectingCategory,
    isPicking,
    isRoundComplete,
    startRound,
    assignToTier,
    removeFromTier,
    moveToTier,
    nextRound,
    changeCategory,
    reset,
  }
}
