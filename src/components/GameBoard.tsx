import type { MediaItem, MediaType, TierType } from '../types'
import { MEDIA_TYPE_LABELS } from '../types'
import type { TierAssignment } from '../hooks/useGame'
import { MediaCard } from './MediaCard'
import styles from './GameBoard.module.css'

interface Props {
  category: MediaType
  remainingItems: MediaItem[]
  assignments: TierAssignment[]
  remainingTiers: TierType[]
  onAssign: (item: MediaItem, tier: TierType) => void
}

export function GameBoard({ category, remainingItems, assignments, remainingTiers, onAssign }: Props) {
  const categoryLabel = MEDIA_TYPE_LABELS[category].singular

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.badge}>{categoryLabel}</span>
        <h2 className={styles.title}>Распредели по тирам</h2>
        <p className={styles.hint}>
          {remainingItems.length > 0
            ? `Осталось: ${remainingItems.length} из 3`
            : 'Все распределены!'}
        </p>
      </div>

      {assignments.length > 0 && (
        <div className={styles.assigned}>
          <h3 className={styles.sectionTitle}>Распределено</h3>
          <div className={styles.assignedGrid}>
            {assignments.map(({ item, tier }) => (
              <MediaCard key={item.id} item={item} assignedTier={tier} showTierButtons={false} />
            ))}
          </div>
        </div>
      )}

      {remainingItems.length > 0 && (
        <div className={styles.remaining}>
          <h3 className={styles.sectionTitle}>Выбери тир</h3>
          <div className={styles.remainingGrid}>
            {remainingItems.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                availableTiers={remainingTiers}
                onAssign={(tier) => onAssign(item, tier)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
