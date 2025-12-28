import type { MediaType, TierType } from '../types'
import { MEDIA_TYPE_LABELS } from '../types'
import type { TierAssignment } from '../hooks/useGame'
import styles from './Results.module.css'

interface Props {
  category: MediaType
  assignments: TierAssignment[]
  history: { category: MediaType; assignments: TierAssignment[] }[]
  onNext: () => void
  onReset: () => void
}

const TIER_ORDER: TierType[] = ['forever', 'once', 'delete']
const TIER_EMOJI: Record<TierType, string> = {
  forever: '💚',
  once: '💛',
  delete: '💔',
}

export function Results({ category, assignments, history, onNext, onReset }: Props) {
  const tierLabels = MEDIA_TYPE_LABELS[category].tiers
  const sortedAssignments = [...assignments].sort(
    (a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier)
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Результаты раунда</h2>
        <span className={styles.badge}>{MEDIA_TYPE_LABELS[category].singular}</span>
      </div>

      <div className={styles.results}>
        {sortedAssignments.map(({ item, tier }) => (
          <div key={item.id} className={`${styles.resultCard} ${styles[tier]}`}>
            <span className={styles.emoji}>{TIER_EMOJI[tier]}</span>
            <div className={styles.resultContent}>
              <span className={styles.tierLabel}>{tierLabels[tier]}</span>
              <span className={styles.itemTitle}>{item.title}</span>
            </div>
          </div>
        ))}
      </div>

      {history.length > 1 && (
        <div className={styles.history}>
          <h3 className={styles.historyTitle}>История раундов</h3>
          <div className={styles.historyGrid}>
            {history.slice(0, -1).map((round, idx) => (
              <div key={idx} className={styles.historyRound}>
                <span className={styles.historyBadge}>
                  {MEDIA_TYPE_LABELS[round.category].singular}
                </span>
                <div className={styles.historyItems}>
                  {round.assignments.map(({ item, tier }) => (
                    <span key={item.id} className={`${styles.historyItem} ${styles[tier]}`}>
                      {TIER_EMOJI[tier]} {item.title}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <button className={styles.nextBtn} onClick={onNext}>
          Следующий раунд
        </button>
        <button className={styles.resetBtn} onClick={onReset}>
          Начать заново
        </button>
      </div>
    </div>
  )
}
