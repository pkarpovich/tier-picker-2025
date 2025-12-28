import { useState, useEffect, useCallback } from 'react'
import type { MediaItem, MediaType } from '../types'

interface GameData {
  games: MediaItem[]
  movies: MediaItem[]
  series: MediaItem[]
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function useGameData() {
  const [data, setData] = useState<GameData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/data.json')
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const getRandomThree = useCallback(
    (type: MediaType): MediaItem[] => {
      if (!data) return []
      const items = type === 'game' ? data.games : type === 'movie' ? data.movies : data.series
      return shuffleArray(items).slice(0, 3)
    },
    [data]
  )

  return { data, loading, error, getRandomThree }
}
