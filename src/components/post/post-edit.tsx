'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { IPostUpdateInput } from '@/lib/type'
import { PostUpdateSchema } from '@/lib/validator'
import { updatePost } from '@/lib/actions/post.action'
import PostTag from './post-tag'

import MdEditor from 'react-markdown-editor-lite'
import ReactMarkdown from 'react-markdown'
import 'react-markdown-editor-lite/lib/index.css'
import PostTooltip from './post-tooltip'

interface PostEditFormProps {
  post: {
    _id: string
    title: string
    slug: string
    category: string
    components?: string
    description?: string
    contents?: string
    image?: string
    tags?: string[]
    isPublished: boolean
    author?: string
    storeId?: string
  }
}

export default function PostEditForm({ post }: PostEditFormProps) {
  const router = useRouter()

  const form = useForm<IPostUpdateInput>({
    resolver: zodResolver(PostUpdateSchema),
    defaultValues: {
      id: post._id,
      title: post.title,
      slug: post.slug,
      category: post.category,
      components: post.components || '',
      description: post.description || '',
      contents: post.contents || '',
      image: post.image || '',
      tags: post.tags || [],
      isPublished: post.isPublished,
      author: post.author || '',
      storeId: post.storeId || '',
    },
  })

  const onSubmit = async (data: IPostUpdateInput) => {
    try {
      const result = await updatePost(data)

      if (result.success) {
        toast.success('수정 완료', {
          description: result.message,
        })
        // 관리자 페이지로 이동
        router.push('/admin')
      } else {
        toast.error('수정 실패', {
          description: result.error,
        })
      }
    } catch (error) {
      toast.error('포스트 수정 중 오류가 발생했습니다.')
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 font-nanum'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>제목 *</FormLabel>
                <FormControl>
                  <Input placeholder='제목을 입력해주세요' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='slug'
            render={({ field }) => (
              <FormItem>
                <FormLabel>슬러그 *</FormLabel>
                <FormControl>
                  <Input placeholder='포스트 주소를 입력해주세요!' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem>
                <FormLabel>카테고리 *</FormLabel>
                <FormControl>
                  <Input placeholder='카테고리를 입력해주세요!' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='components'
            render={({ field }) => (
              <FormItem>
                <FormLabel>컴퍼넌트</FormLabel>
                <FormControl>
                  <Input placeholder='컴퍼넌트를 작성해주세요!' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>설명</FormLabel>
                <FormControl>
                  <Input placeholder='SEO에 해당하는 설명 입력해주세요!' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='storeId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>스토어ID</FormLabel>
                <FormControl>
                  <Input placeholder='스토어 ID가 있다면 입력해주세요!' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='image'
            render={({ field }) => (
              <FormItem>
                <FormLabel>이미지</FormLabel>
                <FormControl>
                  <Input placeholder='이미지 주소를 작성해주세요!' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='author'
            render={({ field }) => (
              <FormItem>
                <FormLabel>작성자</FormLabel>
                <FormControl>
                  <Input placeholder='작성자를 적어주세요!' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='tags'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>태그</FormLabel>
              <FormControl>
                <PostTag
                  tags={field.value || []}
                  onChange={(newTags) => {
                    field.onChange(newTags)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='relative'>
          <Tabs defaultValue='contents' className='w-full'>
            <TabsList>
              <TabsTrigger value='contents'>내용</TabsTrigger>
              <TabsTrigger value='components'>컴퍼넌트</TabsTrigger>
            </TabsList>
            <TabsContent value='contents'>
              <FormField
                control={form.control}
                name='contents'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormControl>
                      <MdEditor
                        value={field.value || ''}
                        style={{ height: '500px' }}
                        renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
                        onChange={({ text }) => {
                          field.onChange(text)
                          form.setValue('contents', text)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            <TabsContent value='components'>
              <FormField
                control={form.control}
                name='components'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormControl>
                      <Input placeholder='컴퍼넌트를 작성하세요!' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>
          <div className='absolute right-0 top-3'>
            <PostTooltip text='설명 또는 컴포넌트를 선택해서 적용할 수 있습니다. 컴포넌트는 코드 작성을 의미합니다.' />
          </div>
        </div>

        <FormField
          control={form.control}
          name='isPublished'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded border p-4'>
              <div className='space-y-0.5'>
                <FormLabel className='text-base'>발행하기</FormLabel>
                <div className='text-sm text-muted-foreground'>
                  포스트를 즉시 발행할지 선택해주세요
                </div>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className='mt-6 flex gap-4'>
          <Button
            type='button'
            size='lg'
            variant='outline'
            onClick={() => router.push('/admin')}
            className='flex-1 py-6'
          >
            취소
          </Button>
          <Button
            type='submit'
            size='lg'
            disabled={form.formState.isSubmitting}
            className='flex-1 py-6'
          >
            {form.formState.isSubmitting ? '수정중...' : '수정하기'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
