import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Clock, Eye, CheckCircle, Trash2 } from 'lucide-react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 인증번호 생성
export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// 날짜 생성 2024.04.03 03:11
export function formatDateTime(dateInput: Date | string): string {
  const d = new Date(dateInput)
  const yyyy = d.getFullYear()
  const MM = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${yyyy}.${MM}.${dd} ${hh}:${mm}`
}

// 문의 사항 상태별 배지 스타일
export const getStatusBadge = (status: string) => {
  switch (status) {
    case '대기중':
      return {
        variant: 'outline' as const,
        color: 'text-orange-600 border-orange-600',
        icon: Clock,
      }
    case '확인완료':
      return {
        variant: 'outline' as const,
        color: 'text-blue-600 border-blue-600',
        icon: Eye,
      }
    case '답장완료':
      return {
        variant: 'outline' as const,
        color: 'text-green-600 border-green-600',
        icon: CheckCircle,
      }
    default:
      return {
        variant: 'outline' as const,
        color: 'text-gray-600',
        icon: Trash2,
      }
  }
}
