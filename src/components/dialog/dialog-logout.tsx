'use client'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { SignOut } from '@/lib/actions/user.action'
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

interface DialogLogoutProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DialogLogout({
  open,
  onOpenChange,
}: DialogLogoutProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const result = await SignOut()

      if (result.success) {
        toast.success('로그아웃 되었습니다.')
        onOpenChange(false)
        router.replace('/')
        router.refresh()
      } else {
        toast.error(result.error || '로그아웃 중 오류가 발생했습니다.')
        onOpenChange(false)
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error)
      toast.error('로그아웃 중 오류가 발생했습니다.')
      onOpenChange(false)
    }
  }

  return (
    <>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말로 로그아웃을 하겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              아쉽지만 그럼 다음에 만나요!😅
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              로그아웃
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
