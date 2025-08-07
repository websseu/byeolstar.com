'use client'

import { Button } from '@/components/ui/button'
import { Baby } from 'lucide-react'

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4'>
      <Baby className='w-16 h-16 text-gray-400 mb-4' />
      <h1 className='text-3xl font-bold mb-2 text-gray-800'>에러가 발생했어요</h1>
      <p className='text-red-600 mb-6 text-center font-nanum'>{error.message}</p>
      <div>
        <Button variant='outline' className='mt-4' onClick={() => reset()}>
          Try again
        </Button>
        <Button
          variant='outline'
          className='mt-4 ml-2 mb-10'
          onClick={() => (window.location.href = '/')}
        >
          Back To Home
        </Button>
      </div>
    </div>
  )
}
