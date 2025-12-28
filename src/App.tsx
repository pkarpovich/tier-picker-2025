import { useGameData } from './hooks/useGameData'
import { useGame } from './hooks/useGame'
import { CategorySelector } from './components/CategorySelector'
import { TierList } from './components/TierList'
import { GoldenParticles } from './components/GoldenParticles'
import './App.css'

function App() {
  const { loading, error, getRandomThree } = useGameData()
  const game = useGame(getRandomThree)

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
    <div className="app">
      <GoldenParticles />

      <header className="header">
        <h1 className="logo" onClick={game.reset}>Tier Picker</h1>
        <p className="tagline">Итоги <span className="yearBadge">2025</span></p>
      </header>

      <main className="main">
        {game.isSelectingCategory && <CategorySelector onSelect={game.startRound} />}

        {!game.isSelectingCategory && game.currentCategory && (
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
        )}
      </main>
    </div>
  )
}

export default App
