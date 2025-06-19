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

interface User {
  _id: string
  name: string
  email: string
  role?: string
  isActive: boolean
  createdAt: string
}

interface DialogUserDeleteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onDeleteConfirm: () => Promise<void>
  isDeleting: boolean
}

export default function DialogUserDelete({
  open,
  onOpenChange,
  user,
  onDeleteConfirm,
  isDeleting,
}: DialogUserDeleteProps) {
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
          <AlertDialogTitle>사용자 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            <span className='font-medium'>
              &quot;{user?.name}&quot; ({user?.email})
            </span>{' '}
            사용자를 정말 삭제하시겠습니까?
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
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white'
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
