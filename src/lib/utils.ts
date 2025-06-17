import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 인증번호 생성
export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// 2025.04.03
export function formatDateWeek(): { date: string; day: string } {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const date = `${year}.${month}.${day}`

  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  const weekday = weekdays[now.getDay()]

  return { date, day: weekday }
}

// 2024.04.03 03:11
export function formatDateTime(dateInput: Date | string): string {
  const d = new Date(dateInput)
  const yyyy = d.getFullYear()
  const MM = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${yyyy}.${MM}.${dd} ${hh}:${mm}`
}

// 2025.04.03
export function formatSimpleDate(dateInput: Date | string): string {
  const d = new Date(dateInput)
  const yyyy = d.getFullYear()
  const MM = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}.${MM}.${dd}`
}

// 글 페이지 날짜
export function formatPostDate(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

// 슬러그
export const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
