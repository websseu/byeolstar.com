import React from 'react'
import { IPost } from '@/lib/db/models/post.model'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { formatDateTime } from '@/lib/utils'
import {
  BookOpen,
  Send,
  Hash,
  Store,
  Eye,
  Heart,
  Star,
  MessageCircle,
  Calendar,
  Clock,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../ui/dialog'

interface DialogPostDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: IPost | null
}

export default function DialogPostDetail({
  open,
  onOpenChange,
  post,
}: DialogPostDetailProps) {
  if (!post) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader className='border-b pb-4'>
          <DialogTitle className='flex items-center font-black text-green-700 justify-center gap-1 text-xl'>
            <BookOpen className='h-5 w-5' />
            게시글 정보
          </DialogTitle>
          <DialogDescription className='text-center text-sm text-muted-foreground'>
            게시글 상세 정보입니다.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-3 text-sm max-h-[60vh] overflow-y-auto'>
          {/* 제목 */}
          <div className='flex items-center gap-2'>
            <BookOpen className='h-4 w-4 text-green-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>제목 : </span>
              <span>{post.title}</span>
            </div>
          </div>

          <Separator />

          {/* 슬러그 */}
          <div className='flex items-center gap-2'>
            <Hash className='h-4 w-4 text-blue-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>슬러그 : </span>
              <span>{post.slug}</span>
            </div>
          </div>

          <Separator />

          {/* 스토어 ID */}
          <div className='flex items-center gap-2'>
            <Store className='h-4 w-4 text-purple-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>스토어 ID : </span>
              <span>{post.storeId || '-'}</span>
            </div>
          </div>

          <Separator />

          {/* 조회수 */}
          <div className='flex items-center gap-2'>
            <Eye className='h-4 w-4 text-blue-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>조회수 : </span>
              <span>{post.numViews || 0}</span>
            </div>
          </div>

          <Separator />

          {/* 좋아요 */}
          <div className='flex items-center gap-2'>
            <Heart className='h-4 w-4 text-red-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>좋아요 : </span>
              <span>{post.numLikes || 0}</span>
            </div>
          </div>

          <Separator />

          {/* 즐겨찾기 */}
          <div className='flex items-center gap-2'>
            <Star className='h-4 w-4 text-yellow-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>즐겨찾기 : </span>
              <span>{post.numFavorites || 0}</span>
            </div>
          </div>

          <Separator />

          {/* 댓글 수 */}
          <div className='flex items-center gap-2'>
            <MessageCircle className='h-4 w-4 text-green-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>댓글수 : </span>
              <span>{post.numComments || 0}</span>
            </div>
          </div>

          <Separator />

          {/* 상태 */}
          <div className='flex items-center gap-2'>
            <div className='h-4 w-4 flex-shrink-0 flex items-center justify-center'>
              <div
                className={`w-3 h-3 rounded-full ${
                  post.isPublished ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
            </div>
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>상태 : </span>
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  post.isPublished
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {post.isPublished ? '공개' : '비공개'}
              </span>
            </div>
          </div>

          <Separator />

          {/* 날짜 정보 */}
          <div className='grid grid-cols-1 gap-2'>
            {/* 작성일 */}
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-gray-600' />
              <span>작성일 : </span>
              <span>{formatDateTime(post.createdAt)}</span>
            </div>

            {/* 수정일 */}
            <div className='flex items-center gap-2'>
              <Clock className='h-4 w-4 text-gray-600' />
              <span>수정일 : </span>
              <span>{formatDateTime(post.updatedAt)}</span>
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
