'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2 } from 'lucide-react'

interface Contact {
  _id: string
  email: string
  title: string
  message: string
  status: '대기중' | '확인완료' | '답장완료'
  createdAt: string
}

interface DialogContactDeleteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact: Contact | null
  onDeleteConfirm: () => Promise<void>
  isDeleting: boolean
}

export default function DialogContactDelete({
  open,
  onOpenChange,
  contact,
  onDeleteConfirm,
  isDeleting,
}: DialogContactDeleteProps) {
  const handleCancel = () => {
    if (!isDeleting) {
      onOpenChange(false)
    }
  }

  const handleConfirm = async () => {
    await onDeleteConfirm()
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>문의사항 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            <span className='font-medium'>&quot;{contact?.title}&quot;</span> 문의사항을 정말
            삭제하시겠습니까?
            <br />
            <span className='text-sm text-muted-foreground'>보낸 사람: {contact?.email}</span>
            <br />
            <span className='text-destructive'>이 작업은 되돌릴 수 없습니다.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isDeleting}>
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {isDeleting ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                삭제 중...
              </>
            ) : (
              '삭제'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
