import { useDroppable } from '@dnd-kit/core'
import type { MediaItem } from '../types'
import { DraggableCard } from './DraggableCard'
import styles from './CardDock.module.css'

interface Props {
  items: MediaItem[]
  isRoundComplete: boolean
  onNextRound: () => void
}

export function CardDock({ items, isRoundComplete, onNextRound }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'dock',
    data: { isDock: true },
  })

  return (
    <div ref={setNodeRef} className={`${styles.dock} ${isOver ? styles.over : ''}`}>
      <div className={styles.label}>Распредели карточки</div>
      <div className={styles.cards}>
        {items.map((item) => (
          <DraggableCard key={item.id} item={item} />
        ))}
        {items.length === 0 && (
          <span className={styles.empty}>Все карточки распределены!</span>
        )}
      </div>
      {isRoundComplete && (
        <button className={styles.nextBtn} onClick={onNextRound}>
          Следующий раунд
        </button>
      )}
    </div>
  )
}
