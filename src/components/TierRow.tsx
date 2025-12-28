import { useDroppable } from '@dnd-kit/core'
import type { MediaItem, TierType } from '../types'
import { DraggableCard } from './DraggableCard'
import styles from './TierRow.module.css'

interface Props {
  tier: TierType
  label: string
  items: MediaItem[]
}

const TIER_CONFIG: Record<TierType, { icon: string; colors: Record<string, string> }> = {
  forever: {
    icon: '💚',
    colors: {
      '--tier-bg': 'rgba(5, 150, 105, 0.15)',
      '--tier-border': 'rgba(5, 150, 105, 0.4)',
      '--tier-border-active': '#10b981',
      '--tier-text': '#34d399',
      '--tier-glow': 'rgba(5, 150, 105, 0.3)',
    },
  },
  once: {
    icon: '💛',
    colors: {
      '--tier-bg': 'rgba(217, 119, 6, 0.15)',
      '--tier-border': 'rgba(217, 119, 6, 0.4)',
      '--tier-border-active': '#f59e0b',
      '--tier-text': '#fbbf24',
      '--tier-glow': 'rgba(217, 119, 6, 0.3)',
    },
  },
  delete: {
    icon: '💔',
    colors: {
      '--tier-bg': 'rgba(220, 38, 38, 0.15)',
      '--tier-border': 'rgba(220, 38, 38, 0.4)',
      '--tier-border-active': '#ef4444',
      '--tier-text': '#f87171',
      '--tier-glow': 'rgba(220, 38, 38, 0.3)',
    },
  },
}

export function TierRow({ tier, label, items }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: tier,
    data: { tier },
  })

  const config = TIER_CONFIG[tier]

  return (
    <div
      ref={setNodeRef}
      className={`${styles.row} ${isOver ? styles.over : ''}`}
      style={config.colors as React.CSSProperties}
    >
      <div className={styles.label}>
        <span className={styles.labelIcon}>{config.icon}</span>
        <span className={styles.labelText}>{label}</span>
      </div>
      <div className={styles.content}>
        {items.map((item) => (
          <DraggableCard key={item.id} item={item} isInTier />
        ))}
        {items.length === 0 && <span className={styles.placeholder}>Перетащи сюда</span>}
      </div>
    </div>
  )
}
