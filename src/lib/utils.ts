import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function tripDuration(start: string, end: string): number {
  const diff = new Date(end).getTime() - new Date(start).getTime()
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1)
}

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function getDatesInRange(start: string, end: string): string[] {
  const dates: string[] = []
  const current = new Date(start)
  const endDate = new Date(end)
  while (current <= endDate) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }
  return dates
}

export const CATEGORY_COLORS: Record<string, string> = {
  accommodation: 'bg-purple-500/20 text-purple-300',
  food: 'bg-orange-500/20 text-orange-300',
  transport: 'bg-blue-500/20 text-blue-300',
  activities: 'bg-green-500/20 text-green-300',
  shopping: 'bg-pink-500/20 text-pink-300',
  other: 'bg-slate-500/20 text-slate-300',
}

export const ACTIVITY_ICONS: Record<string, string> = {
  food: '🍽️',
  attraction: '🏛️',
  transport: '🚌',
  accommodation: '🏨',
  other: '📍',
}

export const COVER_EMOJIS = ['✈️', '🏝️', '🗺️', '🏔️', '🌍', '🏙️', '🗽', '⛷️', '🚢', '🎭']
