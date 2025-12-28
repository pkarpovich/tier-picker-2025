import { useCallback, useEffect } from 'react'
import { Route, Switch, useLocation, useRoute } from 'wouter'
import { useGameData } from './hooks/useGameData'
import { useGame } from './hooks/useGame'
import { CategorySelector } from './components/CategorySelector'
import { TierList } from './components/TierList'
import { GoldenParticles } from './components/GoldenParticles'
import type { MediaType } from './types'
import './App.css'

const VALID_CATEGORIES: MediaType[] = ['game', 'movie', 'series']

function CategoryPage({ category }: { category: MediaType }) {
  const { loading, error, getRandomThree } = useGameData()
  const game = useGame(getRandomThree)

  useEffect(() => {
    if (!loading && !error && game.currentCategory !== category) {
      game.startRound(category)
    }
  }, [loading, error, category, game.currentCategory, game.startRound])

  if (loading) {
    return <div className="loader">Загрузка...</div>
  }

  if (error) {
    return <div className="error">Ошибка: {error}</div>
  }

  if (!game.currentCategory) {
    return <div className="loader">Загрузка...</div>
  }

  return (
    <TierList
      category={game.currentCategory}
      currentItems={game.currentItems}
      tierList={game.tierList}
      isRoundComplete={game.isRoundComplete}
      onAssignToTier={game.assignToTier}
      onRemoveFromTier={game.removeFromTier}
      onMoveToTier={game.moveToTier}
      onNextRound={game.nextRound}
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

  const handleLogoClick = useCallback(() => {
    navigate('/')
  }, [navigate])

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
        </Switch>
      </main>
    </div>
  )
}

export default function App() {
  return <AppContent />
}
