import { useCallback, useState } from 'react'
import { DndContext, DragOverlay, pointerWithin, defaultDropAnimationSideEffects } from '@dnd-kit/core'
import type { DragEndEvent, DropAnimation } from '@dnd-kit/core'
import type { MediaItem, MediaType, TierType } from '../types'
import { MEDIA_TYPE_LABELS } from '../types'
import { TierRow } from './TierRow'
import { CardDock } from './CardDock'
import { DraggableCard } from './DraggableCard'
import styles from './TierList.module.css'

interface Props {
  category: MediaType
  currentItems: MediaItem[]
  tierList: Record<TierType, MediaItem[]>
  remainingItems: number
  isRoundComplete: boolean
  onAssignToTier: (item: MediaItem, tier: TierType) => void
  onRemoveFromTier: (item: MediaItem, tier: TierType) => void
  onMoveToTier: (item: MediaItem, fromTier: TierType, toTier: TierType) => void
  onNextRound: () => void
}

const TIER_ORDER: TierType[] = ['forever', 'once', 'delete']

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
}

export function TierList({
  category,
  currentItems,
  tierList,
  remainingItems,
  isRoundComplete,
  onAssignToTier,
  onRemoveFromTier,
  onMoveToTier,
  onNextRound,
}: Props) {
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null)
  const tierLabels = MEDIA_TYPE_LABELS[category].tiers

  const findItemLocation = useCallback(
    (itemId: string): { tier: TierType } | { dock: true } | null => {
      if (currentItems.some((i) => i.id === itemId)) {
        return { dock: true }
      }
      for (const tier of TIER_ORDER) {
        if (tierList[tier].some((i) => i.id === itemId)) {
          return { tier }
        }
      }
      return null
    },
    [currentItems, tierList]
  )

  const handleDragStart = useCallback(
    (event: { active: { id: string | number } }) => {
      const itemId = String(event.active.id)
      const allItems = [...currentItems, ...TIER_ORDER.flatMap((t) => tierList[t])]
      const item = allItems.find((i) => i.id === itemId)
      if (item) setActiveItem(item)
    },
    [currentItems, tierList]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveItem(null)
      const { active, over } = event
      if (!over) return

      const itemId = String(active.id)
      const location = findItemLocation(itemId)
      if (!location) return

      const allItems = [...currentItems, ...TIER_ORDER.flatMap((t) => tierList[t])]
      const item = allItems.find((i) => i.id === itemId)
      if (!item) return

      const overId = String(over.id)

      if ('dock' in location) {
        if (TIER_ORDER.includes(overId as TierType)) {
          onAssignToTier(item, overId as TierType)
        }
      } else {
        if (overId === 'dock') {
          onRemoveFromTier(item, location.tier)
        } else if (TIER_ORDER.includes(overId as TierType)) {
          onMoveToTier(item, location.tier, overId as TierType)
        }
      }
    },
    [findItemLocation, currentItems, tierList, onAssignToTier, onRemoveFromTier, onMoveToTier]
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.badge}>{MEDIA_TYPE_LABELS[category].singular}</span>
        <span className={styles.counter}>
          Осталось: <span className={styles.counterNumber}>{currentItems.length + remainingItems}</span>
        </span>
      </div>

      <DndContext collisionDetection={pointerWithin} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className={styles.board}>
          <div className={styles.tiers}>
            {TIER_ORDER.map((tier) => (
              <TierRow key={tier} tier={tier} label={tierLabels[tier]} items={tierList[tier]} />
            ))}
          </div>

          <div className={styles.dockWrapper}>
            <CardDock
              items={currentItems}
              isRoundComplete={isRoundComplete}
              remainingItems={remainingItems}
              onNextRound={onNextRound}
            />
          </div>
        </div>

        <DragOverlay dropAnimation={dropAnimation}>
          {activeItem ? <DraggableCard item={activeItem} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
