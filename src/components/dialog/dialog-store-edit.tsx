import React, { useEffect } from 'react'
import { toast } from 'sonner'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import Tags from '../ui/tags'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { StoreUpdateSchema } from '@/lib/validator'
import { IStoreUpdateInput } from '@/lib/type'
import { IStore } from '@/lib/db/models/store.model'
import { updateStore } from '@/lib/actions/store.action'
import {
  Send,
  Hash,
  MapPin,
  Phone,
  BookOpen,
  Globe,
  Tag,
  BookImage,
  Rat,
  Plus,
  X,
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

interface DialogStoreEditProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  store: IStore | null
  onSuccess?: (updatedStore: IStore) => void
}

export default function DialogStoreEdit({
  open,
  onOpenChange,
  store,
  onSuccess,
}: DialogStoreEditProps) {
  const form = useForm<IStoreUpdateInput>({
    resolver: zodResolver(StoreUpdateSchema),
    defaultValues: {
      id: '',
      storeId: '',
      name: '',
      description: '',
      address: '',
      location: '',
      latitude: 0,
      longitude: 0,
      parking: '',
      directions: '',
      since: '',
      phone: '',
      tags: [],
      services: [],
      facilities: [],
      images: [],
    },
  })

  // store 데이터가 변경될 때마다 폼 데이터 업데이트
  useEffect(() => {
    if (store) {
      form.reset({
        id: (store._id as string).toString(),
        storeId: store.storeId || '',
        name: store.name || '',
        description: store.description || '',
        address: store.address || '',
        location: store.location || '',
        latitude: store.latitude || 0,
        longitude: store.longitude || 0,
        parking: store.parking || '',
        directions: store.directions || '',
        since: store.since || '',
        phone: store.phone || '',
        tags: store.tags || [],
        services: store.services || [],
        facilities: store.facilities || [],
        images: store.images || [],
      })
    }
  }, [store, form])

  // 수정하기
  const onSubmit = async (data: IStoreUpdateInput) => {
    try {
      // 빈 이미지 URL 필터링
      const filteredData = {
        ...data,
        images: data.images?.filter((img) => img.trim() !== '') || [],
      }

      const result = await updateStore(filteredData)

      if (result.success) {
        toast.success(result.message || '스토어가 성공적으로 수정되었습니다.')
        onOpenChange(false)
        if (result.store) {
          onSuccess?.(result.store)
        }
      } else {
        toast.error(result.error || '스토어 수정 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('수정 중 오류 발생:', error)
      toast.error('스토어 수정 중 오류가 발생했습니다.')
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
            <Rat className='h-5 w-5' />
            스토어 수정
          </DialogTitle>
          <DialogDescription className='text-center text-sm text-muted-foreground'>
            매장 정보를 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-2 text-sm max-h-[60vh] overflow-y-auto pt-2'>
              {/* 매장명 */}
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='flex items-center'>
                    <FormLabel className='flex-[2.5_2.5_0%]'>
                      <BookOpen className='h-4 w-4 text-green-600' />
                      매장명
                    </FormLabel>
                    <div className='flex-[7.5_7.5_0%] pr-1'>
                      <FormControl>
                        <Input
                          placeholder='매장명을 입력하세요'
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

              {/* 스토어ID */}
              <FormField
                control={form.control}
                name='storeId'
                render={({ field }) => (
                  <FormItem className='flex items-center'>
                    <FormLabel className='flex-[2.5_2.5_0%]'>
                      <Hash className='h-4 w-4 text-purple-600' />
                      스토어ID
                    </FormLabel>
                    <div className='flex-[7.5_7.5_0%] pr-1'>
                      <FormControl>
                        <Input
                          placeholder='스토어ID'
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
                name='description'
                render={({ field }) => (
                  <FormItem className='flex items-center'>
                    <FormLabel className='flex-[2.5_2.5_0%]'>
                      <BookOpen className='h-4 w-4 text-orange-600' />
                      매장 설명
                    </FormLabel>
                    <div className='flex-[7.5_7.5_0%] pr-1'>
                      <FormControl>
                        <Input
                          placeholder='매장 설명을 입력하세요'
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
                name='address'
                render={({ field }) => (
                  <FormItem className='flex items-center'>
                    <FormLabel className='flex-[2.5_2.5_0%]'>
                      <MapPin className='h-4 w-4 text-blue-600' />
                      주소
                    </FormLabel>
                    <div className='flex-[7.5_7.5_0%] pr-1'>
                      <FormControl>
                        <Input placeholder='주소' {...field} className='h-9' />
                      </FormControl>
                      <FormMessage className='mt-2' />
                    </div>
                  </FormItem>
                )}
              />
              <Separator />

              <FormField
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FormItem className='flex items-center'>
                    <FormLabel className='flex-[2.5_2.5_0%]'>
                      <Globe className='h-4 w-4 text-orange-600' />
                      지역
                    </FormLabel>
                    <div className='flex-[7.5_7.5_0%] pr-1'>
                      <FormControl>
                        <Input placeholder='지역' {...field} className='h-9' />
                      </FormControl>
                      <FormMessage className='mt-2' />
                    </div>
                  </FormItem>
                )}
              />
              <Separator />

              <FormField
                control={form.control}
                name='latitude'
                render={({ field }) => (
                  <FormItem className='flex items-center'>
                    <FormLabel className='flex-[2.5_2.5_0%]'>
                      <Hash className='h-4 w-4 text-red-400' />
                      위도
                    </FormLabel>
                    <div className='flex-[7.5_7.5_0%] pr-1'>
                      <FormControl>
                        <Input
                          type='number'
                          step='any'
                          placeholder='위도'
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
                name='longitude'
                render={({ field }) => (
                  <FormItem className='flex items-center'>
                    <FormLabel className='flex-[2.5_2.5_0%]'>
                      <Hash className='h-4 w-4 text-gray-500' />
                      경도
                    </FormLabel>
                    <div className='flex-[7.5_7.5_0%] pr-1'>
                      <FormControl>
                        <Input
                          type='number'
                          step='any'
                          placeholder='경도'
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
                name='parking'
                render={({ field }) => (
                  <FormItem className='flex items-center'>
                    <FormLabel className='flex-[2.5_2.5_0%]'>
                      <Tag className='h-4 w-4 text-green-600' />
                      주차
                    </FormLabel>
                    <div className='flex-[7.5_7.5_0%] pr-1'>
                      <FormControl>
                        <Input
                          placeholder='주차 가능 여부'
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
                name='directions'
                render={({ field }) => (
                  <FormItem className='flex items-center'>
                    <FormLabel className='flex-[2.5_2.5_0%]'>
                      <MapPin className='h-4 w-4 text-purple-600' />
                      오시는길
                    </FormLabel>
                    <div className='flex-[7.5_7.5_0%] pr-1'>
                      <FormControl>
                        <Input
                          placeholder='오시는길 정보를 입력하세요'
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
                name='since'
                render={({ field }) => (
                  <FormItem className='flex items-center'>
                    <FormLabel className='flex-[2.5_2.5_0%]'>
                      <BookOpen className='h-4 w-4 text-blue-600' />
                      오픈연도
                    </FormLabel>
                    <div className='flex-[7.5_7.5_0%] pr-1'>
                      <FormControl>
                        <Input
                          placeholder='오픈연도(예: 2024-02)'
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
                name='phone'
                render={({ field }) => (
                  <FormItem className='flex items-center'>
                    <FormLabel className='flex-[2.5_2.5_0%]'>
                      <Phone className='h-4 w-4 text-orange-600' />
                      전화번호
                    </FormLabel>
                    <div className='flex-[7.5_7.5_0%] pr-1'>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='전화번호'
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
                name='tags'
                render={({ field }) => (
                  <FormItem className='flex items-center'>
                    <FormLabel className='flex-[2.5_2.5_0%]'>
                      <Tag className='h-4 w-4 text-red-600' />
                      태그
                    </FormLabel>
                    <div className='flex-[7.5_7.5_0%] pr-1'>
                      <FormControl>
                        <Tags
                          tags={field.value || []}
                          onChange={field.onChange}
                          placeholder='키워드 태그를 입력하세요!'
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
                name='services'
                render={({ field }) => (
                  <FormItem className='flex items-center'>
                    <FormLabel className='flex-[2.5_2.5_0%]'>
                      <Tag className='h-4 w-4 text-purple-600' />
                      서비스
                    </FormLabel>
                    <div className='flex-[7.5_7.5_0%] pr-1'>
                      <FormControl>
                        <Tags
                          tags={field.value || []}
                          onChange={field.onChange}
                          placeholder='서비스 태그를 입력하세요!'
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
                name='facilities'
                render={({ field }) => (
                  <FormItem className='flex items-center'>
                    <FormLabel className='flex-[2.5_2.5_0%]'>
                      <Tag className='h-4 w-4 text-indigo-600' />
                      편의시설
                    </FormLabel>
                    <div className='flex-[7.5_7.5_0%] pr-1'>
                      <FormControl>
                        <Tags
                          tags={field.value || []}
                          onChange={field.onChange}
                          placeholder='편의시설 태그를 입력하세요!'
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
                name='images'
                render={({ field }) => (
                  <FormItem className='flex items-start'>
                    <FormLabel className='flex-[2.5_2.5_0%] mt-2'>
                      <BookImage className='h-4 w-4 text-blue-600' />
                      이미지
                    </FormLabel>
                    <div className='flex-[7.5_7.5_0%] pr-1 flex flex-col gap-2'>
                      {field.value && field.value.length > 0 ? (
                        field.value.map((image, index) => (
                          <div key={index} className='flex gap-2 items-center'>
                            <Input
                              value={image}
                              placeholder='이미지 URL'
                              className='h-9'
                              onChange={(e) => {
                                const newImages = [...(field.value || [])]
                                newImages[index] = e.target.value
                                field.onChange(newImages)
                              }}
                            />
                            <Button
                              type='button'
                              size='icon'
                              variant='ghost'
                              onClick={() => {
                                const newImages = (field.value || []).filter(
                                  (_, i) => i !== index
                                )
                                field.onChange(newImages)
                              }}
                              className='text-red-600 hover:bg-red-100 bg-red-50 h-9 w-9'
                              title='삭제'
                            >
                              <X className='h-4 w-4' />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className='text-sm text-muted-foreground py-2'>
                          등록된 이미지가 없습니다.
                        </div>
                      )}

                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => {
                          const currentImages = field.value || []
                          field.onChange([...currentImages, ''])
                        }}
                        className='mt-1 w-fit px-3 h-9 text-green-700 border-green-600 hover:text-green-800 hover:bg-green-50 '
                      >
                        <Plus className='h-4 w-4 mr-1' />
                        이미지 추가
                      </Button>
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
                    <Send /> 스토어 수정
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
