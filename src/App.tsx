import { useCallback, useEffect, useState } from 'react'
import { Route, Switch, useLocation, useRoute } from 'wouter'
import { GameProvider, useGameContext } from './context/GameContext'
import { CategorySelector } from './components/CategorySelector'
import { TierList } from './components/TierList'
import { GoldenParticles } from './components/GoldenParticles'
import type { MediaItem, MediaType } from './types'
import './App.css'

const VALID_CATEGORIES: MediaType[] = ['game', 'movie', 'series', 'book']

function CategoryPage({ category }: { category: MediaType }) {
  const { state, remainingInCategory, isRoundComplete, startRound, assignToTier, removeFromTier, moveToTier, nextRound } = useGameContext()

  useEffect(() => {
    if (state.currentCategory !== category) {
      startRound(category)
    }
  }, [category, state.currentCategory, startRound])

  if (!state.currentCategory) {
    return <div className="loader">Загрузка...</div>
  }

  return (
    <TierList
      category={state.currentCategory}
      currentItems={state.currentItems}
      tierList={state.tierList}
      remainingItems={remainingInCategory}
      isRoundComplete={isRoundComplete}
      onAssignToTier={assignToTier}
      onRemoveFromTier={removeFromTier}
      onMoveToTier={moveToTier}
      onNextRound={nextRound}
    />
  )
}

function HomePage() {
  const [, navigate] = useLocation()

  const handleSelect = useCallback(
    (category: MediaType) => {
      navigate(`/${category}`)
    },
    [navigate]
  )

  return <CategorySelector onSelect={handleSelect} />
}

function AppContent() {
  const [, navigate] = useLocation()
  const [matchCategory, params] = useRoute('/:category')
  const { reset } = useGameContext()

  const handleLogoClick = useCallback(() => {
    reset()
    navigate('/')
  }, [reset, navigate])

  if (matchCategory && params?.category && !VALID_CATEGORIES.includes(params.category as MediaType)) {
    navigate('/')
    return null
  }

  return (
    <div className="app">
      <GoldenParticles />

      <header className="header">
        <h1 className="logo" onClick={handleLogoClick}>Tier Picker</h1>
        <p className="tagline">Итоги <span className="yearBadge">2025</span></p>
      </header>

      <main className="main">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/game">
            <CategoryPage category="game" />
          </Route>
          <Route path="/movie">
            <CategoryPage category="movie" />
          </Route>
          <Route path="/series">
            <CategoryPage category="series" />
          </Route>
          <Route path="/book">
            <CategoryPage category="book" />
          </Route>
        </Switch>
      </main>
    </div>
  )
}

interface GameData {
  games: MediaItem[]
  movies: MediaItem[]
  series: MediaItem[]
  books: MediaItem[]
}

export default function App() {
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

  if (loading) {
    return (
      <div className="app">
        <GoldenParticles />
        <div className="loader">Загрузка...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <GoldenParticles />
        <div className="error">Ошибка: {error}</div>
      </div>
    )
  }

  return (
    <GameProvider data={data}>
      <AppContent />
    </GameProvider>
  )
}
