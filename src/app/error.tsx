'use client'

import { Button } from '@/components/ui/button'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen '>
      <div className='p-6 text-center'>
        <h1 className='text-4xl font-poppins font-light mb-4'>Error</h1>
        <p className='text-destructive'>{error.message}</p>
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
