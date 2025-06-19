import { Coffee, TrendingUp, Home, MapPin } from 'lucide-react'

export const starbucksMenus = [
  { name: '국내 스타벅스', href: '/starbucks/domestic' },
  { name: '해외 스타벅스', href: '/starbucks/international' },
  { name: '신규 스타벅스', href: '/starbucks/new' },
  { name: '매장 찾기', href: '/starbucks/store-locator' },
]

export const largeCafeMenu = [
  { name: '서울 카페', href: '/large-cafes/seoul' },
  { name: '전주 카페', href: '/large-cafes/jeonju' },
  { name: '안양 카페', href: '/large-cafes/anyang' },
  { name: '경기도 카페', href: '/large-cafes/gyeonggi' },
]

export const menuItems = [
  { name: '스타벅스', href: '/starbucks', hasDropdown: true, dropdownItems: starbucksMenus },
  { name: '카페 뉴스', href: '/news' },
  { name: '매장 찾기', href: '/store-locator' },
]

export const mobileBottomMenus = [
  { name: '홈', href: '/', icon: Home },
  { name: '스타벅스', href: '/starbucks', icon: Coffee, hasSheet: true },
  { name: '대형카페', href: '/largecafe', icon: Coffee, hasSheet: true },
  { name: '순위', href: '/rankings', icon: TrendingUp },
  { name: '매장찾기', href: '/store-locator', icon: MapPin },
]
