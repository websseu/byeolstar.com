'use client'

import { BadgeCheck, Send } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Notice {
  id: number
  title: string
  date: string
  description: string
}

const notices: Notice[] = [
  {
    id: 1,
    title: '[중요] 곧 오픈합니다.',
    date: '2025.06.13',
    description: '곧 오픈합니다. 많은 기대 부탁드립니다! 최선을 다해 사이트를 준비하고 있습니다.',
  },
  {
    id: 2,
    title: '[중요] 회원가입 기능 추가',
    date: '2025.06.13',
    description:
      '회원가입 기능을 통해 여러가지 편의성 기능을 추가하였습니다. 회원가입 후 다양한 기능을 이용해보세요!',
  },
]

interface DialogNoticeProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DialogNotice({ open, onOpenChange }: DialogNoticeProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader className='border-b pb-6 my-2'>
          <DialogTitle className='flex items-center justify-center gap-2'>
            <BadgeCheck className='h-5 w-5' />
            공지사항
          </DialogTitle>
          <DialogDescription className='text-center'>
            최신 공지사항을 여기서 확인하세요!
          </DialogDescription>
        </DialogHeader>

        {notices.map((notice) => (
          <div key={notice.id} className='border-b pb-4'>
            <div className='flex items-end mb-1'>
              <h3 className='font-semibold text-sm mr-2'>{notice.title}</h3>
              <span className='text-xs text-muted-foreground'>{notice.date}</span>
            </div>
            <p className='text-sm text-muted-foreground leading-6 hover:underline underline-offset-4 cursor-pointer'>
              {notice.description}
            </p>
          </div>
        ))}

        <DialogFooter className='sm:justify-center mt-4'>
          <DialogClose asChild>
            <Button variant='destructive'>
              <Send /> 확인 완료
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
