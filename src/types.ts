export type MediaType = 'game' | 'movie' | 'series'

export interface MediaItem {
  id: string
  title: string
  type: MediaType
  year?: number
  image: string
}

export type TierType = 'forever' | 'once' | 'delete'

export interface TierConfig {
  id: TierType
  label: string
  activeLabel: string
  color: string
  gradient: string
}

export const TIER_CONFIGS: Record<TierType, TierConfig> = {
  forever: {
    id: 'forever',
    label: 'Играть вечно',
    activeLabel: 'Буду играть вечно',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },
  once: {
    id: 'once',
    label: 'Один раз',
    activeLabel: 'Одного раза хватит',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  },
  delete: {
    id: 'delete',
    label: 'Удалить из истории',
    activeLabel: 'Никогда не существовало',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  },
}

export const MEDIA_TYPE_LABELS: Record<MediaType, { singular: string; tiers: Record<TierType, string> }> = {
  game: {
    singular: 'Игра',
    tiers: {
      forever: 'Играть вечно',
      once: 'Одно прохождение',
      delete: 'Стереть из Steam',
    },
  },
  movie: {
    singular: 'Фильм',
    tiers: {
      forever: 'Пересматривать каждый год',
      once: 'Посмотреть один раз',
      delete: 'Никогда не снимали',
    },
  },
  series: {
    singular: 'Сериал',
    tiers: {
      forever: 'Бесконечный ребинж',
      once: 'Один сезон хватит',
      delete: 'Отменить до съёмок',
    },
  },
}
