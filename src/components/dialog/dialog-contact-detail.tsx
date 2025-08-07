import React from 'react'
import { IContact } from '@/lib/db/models/contact.model'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { formatDateTime } from '@/lib/utils'
import {
  CheckCircle,
  Mail,
  MessageSquare,
  Send,
  Calendar,
  Clock,
  AlertCircle,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../ui/dialog'

interface DialogContactDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact: IContact | null
}

export default function DialogContactDetail({
  open,
  onOpenChange,
  contact,
}: DialogContactDetailProps) {
  if (!contact) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader className='border-b pb-4'>
          <DialogTitle className='flex items-center font-black text-green-700 justify-center gap-1 text-xl'>
            <AlertCircle className='h-5 w-5' />
            문의 사항
          </DialogTitle>
          <DialogDescription className='text-center text-sm text-muted-foreground'>
            문의 사항 상세 정보입니다.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-3 text-sm max-h-[60vh] overflow-y-auto'>
          {/* 이메일 */}
          <div className='flex items-center gap-2'>
            <Mail className='h-4 w-4 text-blue-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>이메일 : </span>
              <span>{contact.email}</span>
            </div>
          </div>

          <Separator />

          {/* 문의 내용 */}
          <div className='flex items-start gap-2'>
            <MessageSquare className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>문의 내용 : </span>
              <div className='mt-2 p-3 bg-gray-100 rounded-lg'>
                <p className='whitespace-pre-wrap break-words leading-6 text-gray-900'>
                  {contact.message}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* 상태 */}
          <div className='flex items-center gap-2'>
            <CheckCircle className='h-4 w-4 text-orange-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>처리 상태 : </span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  contact.status === '대기중'
                    ? 'bg-yellow-100 text-yellow-800'
                    : contact.status === '확인완료'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {contact.status}
              </span>
            </div>
          </div>

          <Separator />

          {/* 날짜 정보 */}
          <div className='grid grid-cols-1 gap-2'>
            {/* 접수일 */}
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-gray-600' />
              <span>접수일 : </span>
              <span>{formatDateTime(contact.createdAt)}</span>
            </div>

            {/* 수정일 */}
            <div className='flex items-center gap-2'>
              <Clock className='h-4 w-4 text-gray-600' />
              <span>수정일 : </span>
              <span>{formatDateTime(contact.updatedAt)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className='sm:justify-center border-t pt-4'>
          <Button
            onClick={() => onOpenChange(false)}
            className='w-full bg-green-700 hover:bg-green-800'
          >
            <Send /> 확인 완료
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
