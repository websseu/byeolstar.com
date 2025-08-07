import React from 'react'
import { IUser } from '@/lib/db/models/user.model'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { formatDateTime } from '@/lib/utils'
import Image from 'next/image'
import {
  User,
  Send,
  Mail,
  UserCheck,
  Shield,
  Globe,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ImageIcon,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../ui/dialog'

interface DialogUserDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: IUser | null
}

export default function DialogUserDetail({
  open,
  onOpenChange,
  user,
}: DialogUserDetailProps) {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader className='border-b pb-4'>
          <DialogTitle className='flex items-center font-black text-green-700 justify-center gap-1 text-xl'>
            <User className='h-5 w-5' />
            사용자 정보
          </DialogTitle>
          <DialogDescription className='text-center text-sm text-muted-foreground'>
            사용자 상세 정보입니다.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-3 text-sm max-h-[60vh] overflow-y-auto'>
          {/* 이름 */}
          <div className='flex items-center gap-2'>
            <User className='h-4 w-4 text-green-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>이름 : </span>
              <span>{user.name || '-'}</span>
            </div>
          </div>

          <Separator />

          {/* 사용자명 */}
          <div className='flex items-center gap-2'>
            <UserCheck className='h-4 w-4 text-purple-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>사용자명 : </span>
              <span>@{user.username || '-'}</span>
            </div>
          </div>

          <Separator />

          {/* 이메일 */}
          <div className='flex items-center gap-2'>
            <Mail className='h-4 w-4 text-blue-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>이메일 : </span>
              <span>{user.email}</span>
            </div>
          </div>

          <Separator />

          {/* 이메일 인증 상태 */}
          <div className='flex items-center gap-2'>
            <div className='h-4 w-4 flex-shrink-0 flex items-center justify-center'>
              <CheckCircle className='h-4 w-4 text-green-600' />
            </div>
            <div className='min-w-0 flex-1'>
              <span>이메일 인증 : </span>
              <span>{user.emailVerified ? '인증완료' : '미인증'}</span>
            </div>
          </div>

          <Separator />

          {/* 권한 */}
          <div className='flex items-center gap-2'>
            <Shield className='h-4 w-4 text-orange-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>권한 : </span>
              <span>{user.role === 'admin' ? '관리자' : '일반사용자'}</span>
            </div>
          </div>

          <Separator />

          {/* 로그인 방식 */}
          <div className='flex items-center gap-2'>
            <Globe className='h-4 w-4 text-indigo-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>로그인 방식 : </span>
              <span>{user.provider}</span>
            </div>
          </div>

          <Separator />

          {/* 계정 상태 */}
          <div className='flex items-center gap-2'>
            <div className='h-4 w-4 flex-shrink-0 flex items-center justify-center'>
              <CheckCircle className='h-4 w-4 text-green-600' />
            </div>
            <div className='min-w-0 flex-1'>
              <span>계정 상태 : </span>
              <span>{user.isActive ? '활성' : '비활성'}</span>
            </div>
          </div>

          <Separator />

          {/* 방문 횟수 */}
          <div className='flex items-center gap-2'>
            <Eye className='h-4 w-4 text-blue-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>방문 횟수 : </span>
              <span>{user.visitCount}회</span>
            </div>
          </div>

          <Separator />

          {/* 날짜 정보 */}
          <div className='grid grid-cols-1 gap-2'>
            {/* 가입일 */}
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-gray-600' />
              <span>가입일 : </span>
              <span>{formatDateTime(user.createdAt)}</span>
            </div>

            {/* 수정일 */}
            <div className='flex items-center gap-2'>
              <Clock className='h-4 w-4 text-gray-600' />
              <span>수정일 : </span>
              <span>{formatDateTime(user.updatedAt)}</span>
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
