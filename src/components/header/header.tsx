import React from 'react'
import HeaderLeft from './header-left'
import HeaderRight from './header-right'
import { auth } from '@/auth'

export default async function Header() {
  const session = await auth()
  console.log(session)

  return (
    <header className='header__container'>
      <div className='flex items-center justify-between border-b border-gray-300/20 pb-4'>
        <HeaderLeft />
        <HeaderRight session={session} />
      </div>
    </header>
  )
}
