import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { MediaItem } from '../types'
import styles from './DraggableCard.module.css'

interface Props {
  item: MediaItem
  isInTier?: boolean
  compact?: boolean
}

export function DraggableCard({ item, isInTier = false, compact = false }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: { item },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  const cardClass = [
    styles.card,
    isInTier ? styles.inTier : '',
    compact ? styles.compact : '',
    isDragging ? styles.dragging : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cardClass}
    >
      <div className={styles.imageWrapper}>
        <img src={item.image} alt={item.title} className={styles.image} />
        <div className={styles.imageOverlay} />
      </div>
      <div className={styles.content}>
        <span className={styles.title}>{item.title}</span>
      </div>
    </div>
  )
}
