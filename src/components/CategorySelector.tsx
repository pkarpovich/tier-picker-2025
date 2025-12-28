import type { MediaType } from '../types'
import styles from './CategorySelector.module.css'

interface Props {
  onSelect: (category: MediaType) => void
}

const CATEGORIES: { type: MediaType; emoji: string; label: string }[] = [
  { type: 'game', emoji: '🎮', label: 'Игры' },
  { type: 'movie', emoji: '🎬', label: 'Фильмы' },
  { type: 'series', emoji: '📺', label: 'Сериалы' },
]

export function CategorySelector({ onSelect }: Props) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Выбери категорию</h2>
      <p className={styles.subtitle}>Итоги 2024</p>
      <div className={styles.grid}>
        {CATEGORIES.map(({ type, emoji, label }) => (
          <button key={type} className={styles.card} onClick={() => onSelect(type)}>
            <span className={styles.emoji}>{emoji}</span>
            <span className={styles.label}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
