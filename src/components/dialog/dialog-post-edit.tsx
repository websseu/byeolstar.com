import React, { useEffect } from 'react'
import { toast } from 'sonner'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Switch } from '../ui/switch'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PostUpdateSchema } from '@/lib/validator'
import { IPostUpdateInput } from '@/lib/type'
import { IPost } from '@/lib/db/models/post.model'
import { updatePost } from '@/lib/actions/post.action'
import {
  BookOpen,
  Send,
  Hash,
  Eye,
  Globe,
  FerrisWheel,
  Heart,
  Star,
  MessageCircle,
} from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../ui/dialog'

interface DialogPostEditProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: IPost | null
  onSuccess?: (updatedPost: IPost) => void
}

export default function DialogPostEdit({
  open,
  onOpenChange,
  post,
  onSuccess,
}: DialogPostEditProps) {
  const form = useForm<IPostUpdateInput>({
    resolver: zodResolver(PostUpdateSchema),
    defaultValues: {
      id: '',
      title: '',
      slug: '',
      storeId: '',
      numViews: 0,
      numLikes: 0,
      numFavorites: 0,
      numComments: 0,
      isPublished: false,
    },
  })

  // post 데이터가 변경될 때마다 폼 데이터 업데이트
  useEffect(() => {
    if (post) {
      form.reset({
        id: (post._id as string).toString(),
        title: post.title || '',
        slug: post.slug || '',
        storeId: post.storeId || '',
        numViews: post.numViews || 0,
        numLikes: post.numLikes || 0,
        numFavorites: post.numFavorites || 0,
        numComments: post.numComments || 0,
        isPublished: post.isPublished || false,
      })
    }
  }, [post, form])

  // 수정하기
  const onSubmit = async (data: IPostUpdateInput) => {
    try {
      const result = await updatePost(data)

      if (result.success) {
        toast.success(result.message || '게시글이 성공적으로 수정되었습니다.')
        onOpenChange(false)
        if (result.post) {
          onSuccess?.(result.post)
        }
      } else {
        toast.error(result.error || '게시글 수정 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('수정 중 오류 발생:', error)
      toast.error('게시글 수정 중 오류가 발생했습니다.')
    }
  }

  // 다이얼로그 닫기(폼 초기화)
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      form.reset()
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader className='border-b pb-4'>
          <DialogTitle className='flex items-center font-black text-green-700 justify-center gap-1 text-xl'>
            <FerrisWheel className='h-5 w-5' />글 수정
          </DialogTitle>
          <DialogDescription className='text-center text-sm text-muted-foreground'>
            게시글 정보를 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-2 text-sm max-h-[60vh] overflow-y-auto pt-2'>
              {/* 매장명 */}
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem className='flex items-center'>
                    <FormLabel className='flex-[2.5_2.5_0%]'>
                      <BookOpen className='h-4 w-4 text-green-600' />
                      매장명
                    </FormLabel>
                    <div className='flex-[7.5_7.5_0%] pr-1'>
                      <FormControl>
                        <Input
                          placeholder='제목을 입력하세요'
                          {...field}
                          className='h-9'
                        />
                      </FormControl>
                      <FormMessage className='mt-2' />
                    </div>
                  </FormItem>
                )}
              />
              <Separator />

              <FormField
                control={form.control}
                name='slug'
                render={({ field }) => (
                  <FormItem className='flex items-center'>
                    <FormLabel className='flex-[2.5_2.5_0%]'>
                      <Hash className='h-4 w-4 text-purple-600' />
                      슬러그
                    </FormLabel>
                    <div className='flex-[7.5_7.5_0%] pr-1'>
                      <FormControl>
                        <Input
                          placeholder='URL 슬러그'
                          {...field}
                          className='h-9'
                        />
                      </FormControl>
                      <FormMessage className='mt-2' />
                    </div>
                  </FormItem>
                )}
              />
              <Separator />

              <FormField
                control={form.control}
                name='storeId'
                render={({ field }) => (
                  <FormItem className='flex items-center'>
                    <FormLabel className='flex-[2.5_2.5_0%]'>
                      <Hash className='h-4 w-4 text-red-400' />
                      스토어ID
                    </FormLabel>
                    <div className='flex-[7.5_7.5_0%] pr-1'>
                      <FormControl>
                        <Input
                          placeholder='연결할 스토어ID (선택)'
                          {...field}
                          className='h-9'
                        />
                      </FormControl>
                      <FormMessage className='mt-2' />
                    </div>
                  </FormItem>
                )}
              />
              <Separator />

              <FormField
                control={form.control}
                name='numViews'
                render={({ field }) => (
                  <FormItem className='flex items-center'>
                    <FormLabel className='flex-[2.5_2.5_0%]'>
                      <Eye className='h-4 w-4 text-green-600' />
                      조회수
                    </FormLabel>
                    <div className='flex-[7.5_7.5_0%] pr-1'>
                      <FormControl>
                        <Input
                          type='number'
                          min={0}
                          {...field}
                          className='h-9'
                        />
                      </FormControl>
                      <FormMessage className='mt-2' />
                    </div>
                  </FormItem>
                )}
              />
              <Separator />

              <FormField
                control={form.control}
                name='numLikes'
                render={({ field }) => (
                  <FormItem className='flex items-center'>
                    <FormLabel className='flex-[2.5_2.5_0%]'>
                      <Heart className='h-4 w-4 text-red-600' />
                      좋아요
                    </FormLabel>
                    <div className='flex-[7.5_7.5_0%] pr-1'>
                      <FormControl>
                        <Input
                          type='number'
                          min={0}
                          {...field}
                          className='h-9'
                        />
                      </FormControl>
                      <FormMessage className='mt-2' />
                    </div>
                  </FormItem>
                )}
              />
              <Separator />

              <FormField
                control={form.control}
                name='numFavorites'
                render={({ field }) => (
                  <FormItem className='flex items-center'>
                    <FormLabel className='flex-[2.5_2.5_0%]'>
                      <Star className='h-4 w-4 text-yellow-600' />
                      즐겨찾기
                    </FormLabel>
                    <div className='flex-[7.5_7.5_0%] pr-1'>
                      <FormControl>
                        <Input
                          type='number'
                          min={0}
                          {...field}
                          className='h-9'
                        />
                      </FormControl>
                      <FormMessage className='mt-2' />
                    </div>
                  </FormItem>
                )}
              />
              <Separator />

              <FormField
                control={form.control}
                name='numComments'
                render={({ field }) => (
                  <FormItem className='flex items-center'>
                    <FormLabel className='flex-[2.5_2.5_0%]'>
                      <MessageCircle className='h-4 w-4 text-green-600' />
                      댓글 수
                    </FormLabel>
                    <div className='flex-[7.5_7.5_0%] pr-1'>
                      <FormControl>
                        <Input
                          type='number'
                          min={0}
                          {...field}
                          className='h-9'
                        />
                      </FormControl>
                      <FormMessage className='mt-2' />
                    </div>
                  </FormItem>
                )}
              />
              <Separator />

              <FormField
                control={form.control}
                name='isPublished'
                render={({ field }) => (
                  <FormItem className='flex items-center justify-between mt-4'>
                    <FormLabel>
                      <Globe className='h-4 w-4 text-orange-600' />
                      공개여부
                    </FormLabel>
                    <div className='flex items-center gap-2'>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Badge variant={field.value ? 'outline' : 'destructive'}>
                        {field.value ? '공개' : '비공개'}
                      </Badge>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className='sm:justify-center border-t pt-4 mt-4'>
              <Button
                type='submit'
                disabled={form.formState.isSubmitting}
                className='w-full bg-green-700 hover:bg-green-800'
              >
                {form.formState.isSubmitting ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                    수정 중...
                  </>
                ) : (
                  <>
                    <Send /> 수정하기
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
