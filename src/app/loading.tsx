import React from 'react'

export default function LoadingPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      {/* spinner */}
      <div className='animate-spin h-12 w-12 border-4 border-zinc-600 border-t-transparent rounded-full mb-4' />

      {/* loading text */}
      <div className='p-6 text-center font-nanum text-lg text-zinc-600'>Loading...</div>
    </div>
  )
}
