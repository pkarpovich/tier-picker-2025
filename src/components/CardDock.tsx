import { useDroppable } from '@dnd-kit/core'
import type { MediaItem } from '../types'
import { DraggableCard } from './DraggableCard'
import styles from './CardDock.module.css'

interface Props {
  items: MediaItem[]
  isRoundComplete: boolean
  remainingItems: number
  onNextRound: () => void
}

export function CardDock({ items, isRoundComplete, remainingItems, onNextRound }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'dock',
    data: { isDock: true },
  })

  return (
    <div ref={setNodeRef} className={`${styles.dock} ${isOver ? styles.over : ''}`}>
      <div className={styles.label}>
        {items.length > 0 ? 'Реши их судьбу' : 'Готово'}
      </div>
      <div className={styles.cards}>
        {items.map((item) => (
          <DraggableCard key={item.id} item={item} />
        ))}
      </div>
      {isRoundComplete && remainingItems > 0 && (
        <button className={styles.nextBtn} onClick={onNextRound}>
          Следующий раунд
        </button>
      )}
    </div>
  )
}
