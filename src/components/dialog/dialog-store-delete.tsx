'use client'

import { useState } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteStore } from '@/lib/actions/store.action'
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

interface Store {
  _id: string
  name: string
  address: string
  location: string
  latitude?: number
  longitude?: number
  parking: string
  since: string
  phone?: string
  tags?: string[]
  images?: string[]
  createdAt: string
  updatedAt: string
}

interface DialogStoreDeleteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  store: Store | null
  onDeleteSuccess: (deletedStoreId: string) => void
}

export default function DialogStoreDelete({
  open,
  onOpenChange,
  store,
  onDeleteSuccess,
}: DialogStoreDeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  // 삭제 확인
  const handleDeleteConfirm = async () => {
    if (!store) return

    try {
      setIsDeleting(true)
      const result = await deleteStore(store._id)

      if (result.success) {
        toast.success('삭제 완료', {
          description: result.message,
        })

        // 부모 컴포넌트에 삭제 성공 알림
        onDeleteSuccess(store._id)
        onOpenChange(false)
      } else {
        toast.error('삭제 실패', {
          description: result.error,
        })
      }
    } catch (error) {
      console.error('삭제 중 오류:', error)
      toast.error('삭제 실패', {
        description: '스토어 삭제 중 오류가 발생했습니다.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // 다이얼로그 상태 변경
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isDeleting) {
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-center gap-2'>
            <Trash2 className='h-5 w-5' />
            매장 삭제 확인
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className='space-y-2'>
              <div>
                <span className='font-medium text-foreground'>{store?.name}</span> 매장을 정말
                삭제하시겠습니까?
              </div>
              <div className='text-muted-foreground space-y-1'>
                <div>• 이름: {store?.name}</div>
                <div>• 위치: {store?.location}</div>
                <div className='text-destructive font-medium'>• 이 작업은 되돌릴 수 없습니다.</div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteConfirm}
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
