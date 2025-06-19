'use client'

import React from 'react'
import { GiMoebiusStar, GiOverkill } from 'react-icons/gi'
import { useTheme } from 'next-themes'

export default function HeaderLeft() {
  const { theme, setTheme } = useTheme()
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className='absolute left-2 sm:left-4 top-3 sm:top-5 md:top-9'>
      <button type='button' onClick={toggleTheme} className='circle' aria-label='Toggle Theme'>
        {theme === 'dark' ? <GiOverkill size={20} /> : <GiMoebiusStar size={20} />}
      </button>
    </div>
  )
}
