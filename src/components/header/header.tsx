import React from 'react'
import HeaderLeft from './header-left'
import HeaderLogo from './header-logo'
import HeaderNav from './header-nav'

export default function Header() {
  return (
    <header className='header__container line'>
      <div className='flex items-center justify-center'>
        <HeaderLeft />
        <HeaderLogo />
      </div>
      <HeaderNav />
    </header>
  )
}
