'use client'
import { Button } from '../ui/button'
import type { Pagination } from '@/lib/type'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

interface AdminPaginationProps {
  pagination: Pagination | null
  currentPage: number
  onPageChange: (page: number) => void
}

export default function AdminPagination({
  pagination,
  currentPage,
  onPageChange,
}: AdminPaginationProps) {
  const paginationButtons = () => {
    if (!pagination) return null
    const buttons = []
    const { totalPages } = pagination
    const startPage = Math.max(1, currentPage - 2)
    const endPage = Math.min(totalPages, currentPage + 2)

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? 'default' : 'outline'}
          size='sm'
          onClick={() => onPageChange(i)}
          className='w-8 h-8 p-0'
        >
          {i}
        </Button>
      )
    }
    return buttons
  }

  return (
    <div className='flex justify-center items-center gap-2 my-2'>
      {pagination && pagination.totalPages > 1 && (
        <div className='flex items-center justify-between mt-6'>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onPageChange(1)}
              disabled={!pagination.hasPrevPage}
              className='w-8 h-8 p-0'
            >
              <ChevronsLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className='w-8 h-8 p-0'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <div className='flex gap-1'>{paginationButtons()}</div>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className='w-8 h-8 p-0'
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onPageChange(pagination.totalPages)}
              disabled={!pagination.hasNextPage}
              className='w-8 h-8 p-0'
            >
              <ChevronsRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
