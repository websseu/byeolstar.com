import { ReactNode } from 'react'

const SeparatorWithOr = ({ children }: { children?: ReactNode }) => {
  return (
    <div className='h-5 border-b mb-4 text-center w-full'>
      <span className='bg-background font-poppins font-light px-2 absolute left-1/2 -translate-x-1/2 mt-2 text-muted-foreground'>
        {children ?? 'or'}
      </span>
    </div>
  )
}

export default SeparatorWithOr
