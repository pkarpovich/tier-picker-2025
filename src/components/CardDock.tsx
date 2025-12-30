import { useDroppable } from '@dnd-kit/core'
import type { MediaItem } from '../types'
import { DraggableCard } from './DraggableCard'
import styles from './CardDock.module.css'

interface Props {
  items: MediaItem[]
  isRoundComplete: boolean
  remainingItems: number
  canUseRefresh: boolean
  canUseDoublePick: boolean
  isDoublePickActive: boolean
  onNextRound: () => void
  onRefresh: () => void
  onDoublePick: () => void
}

export function CardDock({
  items,
  isRoundComplete,
  remainingItems,
  canUseRefresh,
  canUseDoublePick,
  isDoublePickActive,
  onNextRound,
  onRefresh,
  onDoublePick,
}: Props) {
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
      {items.length > 0 && (
        <div className={styles.hints}>
          <button
            className={`${styles.hintBtn} ${!canUseRefresh ? styles.hintUsed : ''}`}
            onClick={onRefresh}
            disabled={!canUseRefresh}
            title="Перемешать карточки (1 раз за категорию)"
          >
            🔄 Рефреш
          </button>
          <button
            className={`${styles.hintBtn} ${styles.hintDouble} ${!canUseDoublePick ? styles.hintUsed : ''} ${isDoublePickActive ? styles.hintActive : ''}`}
            onClick={onDoublePick}
            disabled={!canUseDoublePick}
            title="2 карточки в один тир (1 раз за категорию)"
          >
            ✌️ Дубль
          </button>
        </div>
      )}
      {isRoundComplete && remainingItems > 0 && (
        <button className={styles.nextBtn} onClick={onNextRound}>
          Следующий раунд
        </button>
      )}
    </div>
  )
}
