import type { MediaItem, TierType } from '../types'
import { MEDIA_TYPE_LABELS } from '../types'
import styles from './MediaCard.module.css'

interface Props {
  item: MediaItem
  onAssign?: (tier: TierType) => void
  assignedTier?: TierType
  availableTiers?: TierType[]
  showTierButtons?: boolean
}

export function MediaCard({ item, onAssign, assignedTier, availableTiers = [], showTierButtons = true }: Props) {
  const tierLabels = MEDIA_TYPE_LABELS[item.type].tiers

  return (
    <div className={`${styles.card} ${assignedTier ? styles[assignedTier] : ''}`}>
      <div className={styles.content}>
        <h3 className={styles.title}>{item.title}</h3>
        {assignedTier && <span className={styles.tierBadge}>{tierLabels[assignedTier]}</span>}
      </div>

      {showTierButtons && !assignedTier && (
        <div className={styles.actions}>
          {availableTiers.includes('forever') && (
            <button className={`${styles.tierBtn} ${styles.forever}`} onClick={() => onAssign?.('forever')}>
              {tierLabels.forever}
            </button>
          )}
          {availableTiers.includes('once') && (
            <button className={`${styles.tierBtn} ${styles.once}`} onClick={() => onAssign?.('once')}>
              {tierLabels.once}
            </button>
          )}
          {availableTiers.includes('delete') && (
            <button className={`${styles.tierBtn} ${styles.delete}`} onClick={() => onAssign?.('delete')}>
              {tierLabels.delete}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
