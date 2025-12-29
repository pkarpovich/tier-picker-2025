import { useDroppable } from '@dnd-kit/core'
import type { MediaItem, TierType } from '../types'
import { DraggableCard } from './DraggableCard'
import styles from './TierRow.module.css'

interface Props {
  tier: TierType
  label: string
  items: MediaItem[]
  isDisabled?: boolean
}

const TIER_CONFIG: Record<TierType, { icon: string; placeholder: string; colors: Record<string, string> }> = {
  forever: {
    icon: '💚',
    placeholder: 'Жду шедевры...',
    colors: {
      '--tier-bg': 'rgba(135, 154, 57, 0.15)',
      '--tier-border': 'rgba(135, 154, 57, 0.4)',
      '--tier-border-active': '#879A39',
      '--tier-text': '#879A39',
      '--tier-glow': 'rgba(135, 154, 57, 0.3)',
    },
  },
  once: {
    icon: '💛',
    placeholder: 'Жду середняков...',
    colors: {
      '--tier-bg': 'rgba(218, 112, 44, 0.15)',
      '--tier-border': 'rgba(218, 112, 44, 0.4)',
      '--tier-border-active': '#DA702C',
      '--tier-text': '#DA702C',
      '--tier-glow': 'rgba(218, 112, 44, 0.3)',
    },
  },
  delete: {
    icon: '💔',
    placeholder: 'Жду провалы...',
    colors: {
      '--tier-bg': 'rgba(209, 77, 65, 0.15)',
      '--tier-border': 'rgba(209, 77, 65, 0.4)',
      '--tier-border-active': '#D14D41',
      '--tier-text': '#D14D41',
      '--tier-glow': 'rgba(209, 77, 65, 0.3)',
    },
  },
}

export function TierRow({ tier, label, items, isDisabled }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: tier,
    data: { tier },
    disabled: isDisabled,
  })

  const config = TIER_CONFIG[tier]

  return (
    <div
      ref={setNodeRef}
      className={`${styles.row} ${isOver ? styles.over : ''} ${isDisabled ? styles.disabled : ''}`}
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
        {items.length === 0 && <span className={styles.placeholder}>{config.placeholder}</span>}
      </div>
    </div>
  )
}
