'use client'

import { Candy, Send } from 'lucide-react'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { notices } from '@/lib/notice'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DialogNoticeProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DialogNotice({
  open,
  onOpenChange,
}: DialogNoticeProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] flex flex-col'>
        <DialogHeader className='border-b pb-4'>
          <DialogTitle className='flex items-center font-black text-green-700 justify-center gap-1 text-xl'>
            <Candy className='h-5 w-5' />
            공지사항
          </DialogTitle>
          <DialogDescription className='text-center'>
            최신 공지사항을 여기서 확인하세요!
          </DialogDescription>
        </DialogHeader>

        {/* 스크롤 가능한 공지사항 영역 */}
        <ScrollArea className='flex-1 min-h-0 overflow-y-auto -webkit-overflow-scrolling-touch'>
          <div className='space-y-4 pr-2'>
            {notices.map((notice) => (
              <div
                key={notice.id}
                className='border-b border-gray-100 pb-4 last:border-b-0'
              >
                <div className='flex flex-col sm:flex-row sm:items-end gap-1 mb-2'>
                  <h3 className='font-semibold text-sm text-gray-900'>
                    {notice.title}
                  </h3>
                  <span className='text-xs text-muted-foreground'>
                    {notice.date}
                  </span>
                </div>
                <p className='text-sm text-muted-foreground leading-6'>
                  {notice.description}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className='sm:justify-center mt-4 pt-4 border-t'>
          <DialogClose asChild>
            <Button className='w-full bg-green-700 hover:bg-green-800'>
              <Send /> 확인 완료
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
