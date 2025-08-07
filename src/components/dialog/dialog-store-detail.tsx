import React from 'react'
import { IStore } from '@/lib/db/models/store.model'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { formatDateTime } from '@/lib/utils'
import Image from 'next/image'
import {
  Store,
  Send,
  Hash,
  MapPin,
  FileText,
  Phone,
  Calendar,
  Clock,
  Tag,
  Wrench,
  Building,
  Navigation,
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

interface DialogStoreDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  store: IStore | null
}

export default function DialogStoreDetail({
  open,
  onOpenChange,
  store,
}: DialogStoreDetailProps) {
  if (!store) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader className='border-b pb-4'>
          <DialogTitle className='flex items-center font-black text-green-700 justify-center gap-1 text-xl'>
            <Store className='h-5 w-5' />
            스토어 정보
          </DialogTitle>
          <DialogDescription className='text-center text-sm text-muted-foreground'>
            스토어 상세 정보입니다.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-3 text-sm max-h-[60vh] overflow-y-auto'>
          {/* 매장명 */}
          <div className='flex items-center gap-2'>
            <Store className='h-4 w-4 text-green-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>매장명 : </span>
              <span>{store.name}</span>
            </div>
          </div>

          <Separator />

          {/* 스토어 ID */}
          <div className='flex items-center gap-2'>
            <Hash className='h-4 w-4 text-blue-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>스토어 ID : </span>
              <span>{store.storeId}</span>
            </div>
          </div>

          <Separator />

          {/* 설명 */}
          <div className='flex items-center gap-2'>
            <FileText className='h-4 w-4 text-orange-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>설명 : </span>
              <span>{store.description || '-'}</span>
            </div>
          </div>

          <Separator />

          {/* 주소 */}
          <div className='flex items-center gap-2'>
            <MapPin className='h-4 w-4 text-red-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>주소 : </span>
              <span>{store.address || '-'}</span>
            </div>
          </div>

          <Separator />

          {/* 지역 */}
          <div className='flex items-center gap-2'>
            <Building className='h-4 w-4 text-purple-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>지역 : </span>
              <span>{store.location || '-'}</span>
            </div>
          </div>

          <Separator />

          {/* 위도/경도 */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex items-center gap-2'>
              <Navigation className='h-4 w-4 text-indigo-600' />
              <span>위도 : </span>
              <span>{store.latitude || '-'}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Navigation className='h-4 w-4 text-indigo-600' />
              <span>경도:</span>
              <span>{store.longitude || '-'}</span>
            </div>
          </div>

          <Separator />

          {/* 전화번호 */}
          <div className='flex items-center gap-2'>
            <Phone className='h-4 w-4 text-green-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>전화번호 : </span>
              <span>{store.phone || '-'}</span>
            </div>
          </div>

          <Separator />

          {/* 오픈일 */}
          <div className='flex items-center gap-2'>
            <Calendar className='h-4 w-4 text-yellow-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>오픈일 : </span>
              <span>{store.since || '-'}</span>
            </div>
          </div>

          <Separator />

          {/* 주차 정보 */}
          <div className='flex items-center gap-2'>
            <Building className='h-4 w-4 text-blue-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>주차 정보 : </span>
              <span>{store.parking || '-'}</span>
            </div>
          </div>

          <Separator />

          {/* 오시는길 */}
          <div className='flex items-center gap-2'>
            <Navigation className='h-4 w-4 text-purple-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span>오시는길 : </span>
              <span>{store.directions || '-'}</span>
            </div>
          </div>

          <Separator />

          {/* 태그 */}
          <div className='flex items-center gap-2'>
            <Tag className='h-4 w-4 text-indigo-600 flex-shrink-0' />
            <div className='min-w-0 flex-1 flex items-center'>
              <span className='font-medium text-gray-700'>태그 : </span>
              <div className='ml-2 flex flex-wrap gap-1'>
                {store.tags && store.tags.length > 0 ? (
                  store.tags.map((tag, index) => (
                    <span
                      key={index}
                      className='px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full'
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className='text-gray-500'>태그가 없습니다.</span>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* 서비스 */}
          <div className='flex items-center gap-2'>
            <Wrench className='h-4 w-4 text-orange-600 flex-shrink-0' />
            <div className='min-w-0 flex-1 flex items-center'>
              <span className='font-medium text-gray-700'>서비스 : </span>
              <div className='ml-2 flex flex-wrap gap-1'>
                {store.services && store.services.length > 0 ? (
                  store.services.map((service, index) => (
                    <span
                      key={index}
                      className='px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full'
                    >
                      {service}
                    </span>
                  ))
                ) : (
                  <span className='text-gray-500'>서비스가 없습니다.</span>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* 편의시설 */}
          <div className='flex items-center gap-2'>
            <Building className='h-4 w-4 text-green-600 flex-shrink-0' />
            <div className='min-w-0 flex-1 flex items-center'>
              <span className='font-medium text-gray-700'>편의시설 : </span>
              <div className='ml-2 flex flex-wrap gap-1'>
                {store.facilities && store.facilities.length > 0 ? (
                  store.facilities.map((facility, index) => (
                    <span
                      key={index}
                      className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'
                    >
                      {facility}
                    </span>
                  ))
                ) : (
                  <span className='text-gray-500'>편의시설이 없습니다.</span>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* 이미지 */}
          <div className='flex items-start gap-2'>
            <ImageIcon className='h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>
                이미지 : {store.images?.length || 0}개
              </span>
              <div className='text-gray-900'>
                {store.images && store.images.length > 0 ? (
                  <div className='mt-2 grid grid-cols-2 gap-2'>
                    {store.images.map((image, index) => (
                      <div
                        key={index}
                        className='relative aspect-video bg-gray-100 rounded overflow-hidden'
                      >
                        <Image
                          src={image}
                          alt={`${store.name} 이미지 ${index + 1}`}
                          className='w-full h-full object-cover'
                          width={400}
                          height={300}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className='ml-2 text-gray-500'>
                    등록된 이미지가 없습니다.
                  </span>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* 날짜 정보 */}
          <div className='grid grid-cols-1 gap-2'>
            {/* 작성일 */}
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-gray-600' />
              <span>작성일 : </span>
              <span>{formatDateTime(store.createdAt)}</span>
            </div>

            {/* 수정일 */}
            <div className='flex items-center gap-2'>
              <Clock className='h-4 w-4 text-gray-600' />
              <span>수정일 : </span>
              <span>{formatDateTime(store.updatedAt)}</span>
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
