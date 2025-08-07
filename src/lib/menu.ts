import { Home, Bath, Carrot, Dessert, Drum, IceCreamBowl, Ghost, Siren } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface NavItem {
  icon: LucideIcon
  label: string
  href: string
  type: 'page' | 'dialog'
}

export const menuItems: NavItem[] = [
  { icon: Home, label: '홈', href: '/', type: 'page' },
  { icon: Bath, label: '공지사항', href: '#notice', type: 'dialog' },
  { icon: Carrot, label: '문의하기', href: '#contact', type: 'dialog' },
  { icon: Dessert, label: '기록 관리', href: '/records', type: 'page' },
  { icon: Drum, label: '프로필', href: '/profile', type: 'page' },
]

export const authItems: NavItem[] = [
  { icon: IceCreamBowl, label: '로그인', href: '#login', type: 'dialog' },
  { icon: Ghost, label: '회원가입', href: '#signup', type: 'dialog' },
]

export const loggedInItems: NavItem[] = [
  { icon: Siren, label: '로그아웃', href: '#logout', type: 'dialog' },
]
