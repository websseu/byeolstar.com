'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { StoreIcon, X } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { updateStore } from '@/lib/actions/store.action'
import type { IStoreInput } from '@/lib/type'
import { StoreInputSchema } from '@/lib/validator'

// Store 인터페이스
interface StoreType {
  _id: string
  name: string
  address: string
  location: string
  storeId: string
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

interface DialogStoreEditProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  store: StoreType | null
  onUpdateSuccess: (updatedStore: StoreType) => void
}

export default function DialogStoreEdit({
  open,
  onOpenChange,
  store,
  onUpdateSuccess,
}: DialogStoreEditProps) {
  const [tagInput, setTagInput] = useState('')
  const [isComposing, setIsComposing] = useState(false)

  const form = useForm<IStoreInput>({
    resolver: zodResolver(StoreInputSchema),
    defaultValues: {
      name: '',
      address: '',
      location: '',
      storeId: '',
      latitude: 0,
      longitude: 0,
      parking: '',
      since: '',
      phone: '',
      tags: [],
      images: [],
    },
  })

  const tags = form.watch('tags') || []

  // 매장 데이터가 변경될 때 폼 초기화
  useEffect(() => {
    if (store && open) {
      form.reset({
        name: store.name || '',
        address: store.address || '',
        location: store.location || '',
        storeId: store.storeId || '',
        latitude: store.latitude || 0,
        longitude: store.longitude || 0,
        parking: store.parking || '',
        since: store.since || '',
        phone: store.phone || '',
        tags: store.tags || [],
        images: store.images || [],
      })
      setTagInput('')
    }
  }, [store, open, form])

  // 매장 정보 수정
  const onSubmit = async (data: IStoreInput) => {
    if (!store) return

    try {
      const result = await updateStore(store._id, data)

      if (result.success) {
        toast.success('매장 정보가 성공적으로 수정되었습니다.')
        onUpdateSuccess(result.store)
        onOpenChange(false)
      } else {
        toast.error(result.error || '매장 수정 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('매장 수정 중 오류:', error)
      toast.error('매장 수정 중 오류가 발생했습니다.')
    }
  }

  // 태그 추가/제거
  const handleTagAdd = (newTag: string) => {
    const trimmed = newTag.trim()
    if (!trimmed) return

    const lowerTags = tags.map((tag) => tag.toLowerCase())
    if (!lowerTags.includes(trimmed.toLowerCase())) {
      form.setValue('tags', [...tags, trimmed])
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    const updated = tags.filter((tag) => tag !== tagToRemove)
    form.setValue('tags', updated)
  }

  // 다이얼로그 닫기 시 폼 초기화
  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset()
      setTagInput('')
      setIsComposing(false)
    }
    onOpenChange(isOpen)
  }

  if (!store) return null

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className='sm:max-w-[600px] max-h-[80vh] overflow-y-auto'>
        <DialogHeader className='border-b pb-4 mb-2'>
          <DialogTitle className='flex items-center gap-2'>
            <StoreIcon className='h-5 w-5' />
            매장 정보 수정
          </DialogTitle>
          <DialogDescription>매장 정보를 수정하고 저장하세요.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* 기본 정보 */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>매장명 *</FormLabel>
                    <FormControl>
                      <Input placeholder='매장명을 입력하세요' {...field} />
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
                    <FormLabel>스토어 ID *</FormLabel>
                    <FormControl>
                      <Input placeholder='고유한 스토어 ID' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-[2fr_8fr] gap-4'>
              <FormField
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>지역 *</FormLabel>
                    <FormControl>
                      <Input placeholder='지역을 입력하세요 (예: 서울, 부산)' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-1'>주소 *</FormLabel>
                    <FormControl>
                      <Input placeholder='상세 주소를 입력하세요' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 부가 정보 */}
            <div className='grid grid-cols-1 md:grid-cols-[2fr_8fr] gap-4'>
              <FormField
                control={form.control}
                name='since'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-1'>개점일 *</FormLabel>
                    <FormControl>
                      <Input placeholder='YYYY-MM-DD' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='parking'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-1'>주차 정보 *</FormLabel>
                    <FormControl>
                      <Input placeholder='무료/유료/불가' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 연락처 */}
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>전화번호</FormLabel>
                  <FormControl>
                    <Input placeholder='전화번호를 입력하세요' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 좌표 정보 */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='latitude'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>위도</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='any'
                        placeholder='위도 (예: 37.5665)'
                        {...field}
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='longitude'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>경도</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='any'
                        placeholder='경도 (예: 126.9780)'
                        {...field}
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 태그 */}
            <FormField
              control={form.control}
              name='tags'
              render={() => (
                <FormItem>
                  <FormLabel>태그</FormLabel>
                  <div className='space-y-2'>
                    <div className='flex flex-wrap gap-2'>
                      {tags.map((tag, index) => (
                        <Badge key={index} variant='secondary' className='flex items-center gap-1'>
                          {tag}
                          <button
                            type='button'
                            className='ml-1 hover:text-destructive'
                            onClick={() => handleTagRemove(tag)}
                          >
                            <X className='h-3 w-3' />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder='태그를 입력하고 Enter를 누르세요'
                      onCompositionStart={() => setIsComposing(true)}
                      onCompositionEnd={() => setIsComposing(false)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isComposing) {
                          e.preventDefault()
                          if (tagInput.trim().length > 0) {
                            handleTagAdd(tagInput)
                            setTagInput('')
                          }
                        }
                      }}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 버튼 */}
            <div className='flex gap-2 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                className='flex-1'
              >
                취소
              </Button>
              <Button type='submit' disabled={form.formState.isSubmitting} className='flex-1'>
                {form.formState.isSubmitting ? '수정 중...' : '수정 완료'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
