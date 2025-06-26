'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { starbucksMenus, largeCafeMenu, menuItems, mobileBottomMenus } from '@/lib/menu'

export default function HeaderNav() {
  const [isStarbucksSheetOpen, setIsStarbucksSheetOpen] = useState(false)
  const [isLargeCafeSheetOpen, setIsLargeCafeSheetOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <nav className='header__nav'>
        {/* Desktop Navigation */}
        <div className='hidden md:block px-4 bg-background'>
          <ul className='flex items-center bg-background gap-1'>
            {menuItems.map((item) => (
              <li key={item.name} className='relative'>
                {item.hasDropdown ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        size='lg'
                        className='flex items-center font-nanum font-bold bg-background'
                      >
                        {item.name}
                        <ChevronDown className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-48' align='center'>
                      {item.dropdownItems?.map((subItem, index) => (
                        <div key={subItem.name}>
                          <DropdownMenuItem asChild>
                            <Link
                              href={subItem.href}
                              className='flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 font-medium'
                            >
                              {subItem.name}
                            </Link>
                          </DropdownMenuItem>
                          {index < item.dropdownItems!.length - 1 && <DropdownMenuSeparator />}
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href={item.href}
                    className='font-nanum font-bold bg-background text-sm hover:bg-accent px-6 py-2 rounded w-[110px] block text-center'
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Bottom Navigation - 새로 추가된 하단 메뉴바 */}
      <div className='md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg'>
        <div className='flex items-center justify-around py-2'>
          {mobileBottomMenus.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            if (item.hasSheet) {
              return (
                <Sheet
                  key={item.name}
                  open={
                    item.name === '스타벅스'
                      ? isStarbucksSheetOpen
                      : item.name === '대형카페'
                      ? isLargeCafeSheetOpen
                      : false
                  }
                  onOpenChange={
                    item.name === '스타벅스'
                      ? setIsStarbucksSheetOpen
                      : item.name === '대형카페'
                      ? setIsLargeCafeSheetOpen
                      : undefined
                  }
                >
                  <SheetTrigger asChild>
                    <button
                      className={`flex flex-col items-center justify-center p-2 min-w-[60px] transition-colors ${
                        active ? 'text-green-600' : 'text-gray-500 hover:text-green-600'
                      }`}
                    >
                      <Icon className='h-5 w-5 mb-1' />
                      <span className='text-xs font-medium font-nanum'>{item.name}</span>
                    </button>
                  </SheetTrigger>
                  <SheetContent side='bottom' className='h-[300px]'>
                    <SheetHeader>
                      <SheetTitle className='text-left font-nanum'>{item.name} 메뉴</SheetTitle>
                    </SheetHeader>
                    <div className='grid grid-cols-2 gap-3 mt-6'>
                      {(item.name === '스타벅스' ? starbucksMenus : largeCafeMenu).map(
                        (subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className='flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors'
                            onClick={() => {
                              if (item.name === '스타벅스') setIsStarbucksSheetOpen(false)
                              if (item.name === '대형카페') setIsLargeCafeSheetOpen(false)
                            }}
                          >
                            <span className='font-medium text-center font-nanum'>
                              {subItem.name}
                            </span>
                          </Link>
                        )
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              )
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center p-2 min-w-[60px] transition-colors ${
                  active ? 'text-green-600' : 'text-gray-500 hover:text-green-600'
                }`}
              >
                <Icon className='h-5 w-5 mb-1' />
                <span className='text-xs font-medium font-nanum'>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
