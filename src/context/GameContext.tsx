import { createContext, useContext, useReducer, useCallback, useMemo, useEffect, type ReactNode } from 'react'
import type { MediaItem, MediaType, TierType } from '../types'

interface GameState {
  currentCategory: MediaType | null
  currentItems: MediaItem[]
  tierList: Record<TierType, MediaItem[]>
  usedIds: Set<string>
  usedTiersInRound: Set<TierType>
  refreshUsedThisRound: boolean
  doublePickUsed: boolean
  doublePickActiveThisRound: boolean
}

type GameAction =
  | { type: 'START_ROUND'; category: MediaType; items: MediaItem[] }
  | { type: 'NEXT_ROUND'; items: MediaItem[] }
  | { type: 'ASSIGN_TO_TIER'; item: MediaItem; tier: TierType }
  | { type: 'REMOVE_FROM_TIER'; item: MediaItem; tier: TierType }
  | { type: 'MOVE_TO_TIER'; item: MediaItem; fromTier: TierType; toTier: TierType }
  | { type: 'USE_REFRESH'; items: MediaItem[] }
  | { type: 'USE_DOUBLE_PICK' }
  | { type: 'LOAD_STATE'; state: GameState }
  | { type: 'RESET' }

const initialState: GameState = {
  currentCategory: null,
  currentItems: [],
  tierList: { forever: [], once: [], delete: [] },
  usedIds: new Set(),
  usedTiersInRound: new Set(),
  refreshUsedThisRound: false,
  doublePickUsed: false,
  doublePickActiveThisRound: false,
}

const STORAGE_KEY = 'tierPicker_state'

function saveToStorage(state: GameState) {
  if (!state.currentCategory) return
  const serializable = {
    currentCategory: state.currentCategory,
    currentItems: state.currentItems,
    tierList: state.tierList,
    usedIds: Array.from(state.usedIds),
    usedTiersInRound: Array.from(state.usedTiersInRound),
    refreshUsedThisRound: state.refreshUsedThisRound,
    doublePickUsed: state.doublePickUsed,
    doublePickActiveThisRound: state.doublePickActiveThisRound,
  }
  localStorage.setItem(`${STORAGE_KEY}_${state.currentCategory}`, JSON.stringify(serializable))
}

function loadFromStorage(category: MediaType): GameState | null {
  const stored = localStorage.getItem(`${STORAGE_KEY}_${category}`)
  if (!stored) return null
  const parsed = JSON.parse(stored)
  return {
    currentCategory: parsed.currentCategory,
    currentItems: parsed.currentItems,
    tierList: parsed.tierList,
    usedIds: new Set(parsed.usedIds),
    usedTiersInRound: new Set(parsed.usedTiersInRound),
    refreshUsedThisRound: parsed.refreshUsedThisRound ?? false,
    doublePickUsed: parsed.doublePickUsed ?? false,
    doublePickActiveThisRound: parsed.doublePickActiveThisRound ?? false,
  }
}

function clearStorage(category: MediaType) {
  localStorage.removeItem(`${STORAGE_KEY}_${category}`)
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_ROUND': {
      const newUsedIds = new Set(action.items.map((i) => i.id))
      return {
        currentCategory: action.category,
        currentItems: action.items,
        tierList: { forever: [], once: [], delete: [] },
        usedIds: newUsedIds,
        usedTiersInRound: new Set(),
        refreshUsedThisRound: false,
        doublePickUsed: false,
        doublePickActiveThisRound: false,
      }
    }
    case 'NEXT_ROUND': {
      const newUsedIds = new Set(state.usedIds)
      action.items.forEach((i) => newUsedIds.add(i.id))
      return {
        ...state,
        currentItems: action.items,
        usedIds: newUsedIds,
        usedTiersInRound: new Set(),
        doublePickActiveThisRound: false,
      }
    }
    case 'ASSIGN_TO_TIER': {
      const newUsedTiers = new Set(state.usedTiersInRound)
      const alreadyHasTier = newUsedTiers.has(action.tier)
      if (!alreadyHasTier || !state.doublePickActiveThisRound) {
        newUsedTiers.add(action.tier)
      }
      return {
        ...state,
        currentItems: state.currentItems.filter((i) => i.id !== action.item.id),
        tierList: {
          ...state.tierList,
          [action.tier]: [...state.tierList[action.tier], action.item],
        },
        usedTiersInRound: newUsedTiers,
        doublePickActiveThisRound: alreadyHasTier && state.doublePickActiveThisRound ? false : state.doublePickActiveThisRound,
      }
    }
    case 'REMOVE_FROM_TIER': {
      const newUsedTiers = new Set(state.usedTiersInRound)
      newUsedTiers.delete(action.tier)
      return {
        ...state,
        currentItems: [...state.currentItems, action.item],
        tierList: {
          ...state.tierList,
          [action.tier]: state.tierList[action.tier].filter((i) => i.id !== action.item.id),
        },
        usedTiersInRound: newUsedTiers,
      }
    }
    case 'MOVE_TO_TIER': {
      if (action.fromTier === action.toTier) return state
      const newUsedTiers = new Set(state.usedTiersInRound)
      newUsedTiers.delete(action.fromTier)
      newUsedTiers.add(action.toTier)
      return {
        ...state,
        tierList: {
          ...state.tierList,
          [action.fromTier]: state.tierList[action.fromTier].filter((i) => i.id !== action.item.id),
          [action.toTier]: [...state.tierList[action.toTier], action.item],
        },
        usedTiersInRound: newUsedTiers,
      }
    }
    case 'USE_REFRESH': {
      const newUsedIds = new Set(state.usedIds)
      state.currentItems.forEach((i) => newUsedIds.delete(i.id))
      action.items.forEach((i) => newUsedIds.add(i.id))
      return {
        ...state,
        currentItems: action.items,
        usedIds: newUsedIds,
        refreshUsedThisRound: true,
      }
    }
    case 'USE_DOUBLE_PICK':
      return {
        ...state,
        doublePickUsed: true,
        doublePickActiveThisRound: true,
      }
    case 'LOAD_STATE':
      return action.state
    case 'RESET':
      return initialState
    default:
      return state
  }
}

interface GameContextValue {
  state: GameState
  remainingInCategory: number
  isRoundComplete: boolean
  canUseRefresh: boolean
  canUseDoublePick: boolean
  startRound: (category: MediaType) => void
  assignToTier: (item: MediaItem, tier: TierType) => void
  removeFromTier: (item: MediaItem, tier: TierType) => void
  moveToTier: (item: MediaItem, fromTier: TierType, toTier: TierType) => void
  nextRound: () => void
  useRefresh: () => void
  useDoublePick: () => void
  reset: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

interface GameProviderProps {
  children: ReactNode
  data: {
    games: MediaItem[]
    movies: MediaItem[]
    series: MediaItem[]
    books: MediaItem[]
  } | null
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function GameProvider({ children, data }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  const getCategoryItems = useCallback(
    (type: MediaType): MediaItem[] => {
      if (!data) return []
      const categoryMap = {
        game: data.games,
        movie: data.movies,
        series: data.series,
        book: data.books,
      }
      return categoryMap[type]
    },
    [data]
  )

  const getNewItems = useCallback(
    (category: MediaType, usedIds: Set<string>): MediaItem[] => {
      const allItems = getCategoryItems(category)
      const available = allItems.filter((item) => !usedIds.has(item.id))
      if (available.length >= 3) {
        return shuffleArray(available).slice(0, 3)
      }
      return shuffleArray(available)
    },
    [getCategoryItems]
  )

  const remainingInCategory = useMemo(() => {
    if (!state.currentCategory || !data) return 0
    const total = getCategoryItems(state.currentCategory).length
    return total - state.usedIds.size
  }, [state.currentCategory, state.usedIds.size, data, getCategoryItems])

  const isRoundComplete = state.currentItems.length === 0 && state.currentCategory !== null

  const canUseRefresh = !state.refreshUsedThisRound && state.currentItems.length > 0

  const canUseDoublePick = !state.doublePickUsed && state.currentItems.length > 0

  const startRound = useCallback(
    (category: MediaType) => {
      if (state.currentCategory === category) return
      const savedState = loadFromStorage(category)
      if (savedState) {
        dispatch({ type: 'LOAD_STATE', state: savedState })
        return
      }
      const items = getNewItems(category, new Set())
      dispatch({ type: 'START_ROUND', category, items })
    },
    [state.currentCategory, getNewItems]
  )

  const nextRound = useCallback(() => {
    if (!state.currentCategory) return
    const items = getNewItems(state.currentCategory, state.usedIds)
    if (items.length > 0) {
      dispatch({ type: 'NEXT_ROUND', items })
    }
  }, [state.currentCategory, state.usedIds, getNewItems])

  const assignToTier = useCallback((item: MediaItem, tier: TierType) => {
    dispatch({ type: 'ASSIGN_TO_TIER', item, tier })
  }, [])

  const removeFromTier = useCallback((item: MediaItem, tier: TierType) => {
    dispatch({ type: 'REMOVE_FROM_TIER', item, tier })
  }, [])

  const moveToTier = useCallback((item: MediaItem, fromTier: TierType, toTier: TierType) => {
    dispatch({ type: 'MOVE_TO_TIER', item, fromTier, toTier })
  }, [])

  const useRefresh = useCallback(() => {
    if (!state.currentCategory || state.refreshUsedThisRound) return
    const currentItemIds = new Set(state.currentItems.map((i) => i.id))
    const usedIdsWithoutCurrent = new Set(state.usedIds)
    currentItemIds.forEach((id) => usedIdsWithoutCurrent.delete(id))
    const items = getNewItems(state.currentCategory, usedIdsWithoutCurrent)
    if (items.length > 0) {
      dispatch({ type: 'USE_REFRESH', items })
    }
  }, [state.currentCategory, state.refreshUsedThisRound, state.currentItems, state.usedIds, getNewItems])

  const useDoublePick = useCallback(() => {
    if (state.doublePickUsed) return
    dispatch({ type: 'USE_DOUBLE_PICK' })
  }, [state.doublePickUsed])

  const reset = useCallback(() => {
    if (state.currentCategory) {
      clearStorage(state.currentCategory)
    }
    dispatch({ type: 'RESET' })
  }, [state.currentCategory])

  useEffect(() => {
    saveToStorage(state)
  }, [state])

  const value = useMemo(
    () => ({
      state,
      remainingInCategory,
      isRoundComplete,
      canUseRefresh,
      canUseDoublePick,
      startRound,
      assignToTier,
      removeFromTier,
      moveToTier,
      nextRound,
      useRefresh,
      useDoublePick,
      reset,
    }),
    [state, remainingInCategory, isRoundComplete, canUseRefresh, canUseDoublePick, startRound, assignToTier, removeFromTier, moveToTier, nextRound, useRefresh, useDoublePick, reset]
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGameContext() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider')
  }
  return context
}
