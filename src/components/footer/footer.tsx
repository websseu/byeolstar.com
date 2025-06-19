import React from 'react'
import { APP_COPYRIGHT, APP_NAME } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className='footer__container'>
      <div className='font-nanum border-t py-8'>
        <h6 className='text-xl font-light font-poppins mb-2'>{APP_NAME}</h6>
        <p className='text-zinc-500 md:w-1/2 w-full leading-5 text-sm mb-2'>
          따뜻한 감성 카페부터
          <br />
          별처럼 반짝이는 커피 경험까지 만나보세요.
        </p>
        <p className='text-xs mt-1 text-muted-foreground'>{APP_COPYRIGHT}</p>
      </div>
    </footer>
  )
}
