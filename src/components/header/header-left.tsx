import React from 'react'
import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'

export default function HeaderLeft() {
  return (
    <Link
      href={'/'}
      className='font-gmarket text-2xl font-bold text-green-700 pt-1 block'
    >
      {APP_NAME}
    </Link>
  )
}
