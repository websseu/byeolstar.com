'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, MapPin, Calendar, Eye, Heart, Loader2 } from 'lucide-react'
import { getPublishedPosts, getPostCountsByCategory } from '@/lib/actions/post.action'
import { formatSimpleDate } from '@/lib/utils'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination'

interface Post {
  _id: string
  title: string
  slug: string
  category: string
  description: string
  image: string
  createdAt: string
  numViews: number
  numLikes: number
  storeId?: {
    _id: string
    name: string
    address: string
    location: string
    images: string[]
    tags: string[]
    parking: boolean | string
    since: string
    phone: string
    storeId: string
  }
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export default function StarbucksPostsList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(9)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)

  // 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // 카테고리 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory])

  // 카테고리별 포스트 개수 가져오기
  const fetchCategoryCounts = useCallback(async () => {
    try {
      const result = await getPostCountsByCategory()
      if (result.success) {
        setCategoryCounts(result.counts)
      }
    } catch (error) {
      console.error('카테고리 개수 조회 오류:', error)
    }
  }, [])

  // 데이터 가져오기
  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true)
      const result = await getPublishedPosts(
        currentPage,
        pageSize,
        debouncedSearchTerm || undefined,
        selectedCategory === 'all' ? undefined : selectedCategory
      )

      if (result.success) {
        setPosts(result.posts)
        setPagination(result.pagination!)
        setError(null)
      } else {
        setError(result.error || '데이터를 불러오는데 실패했습니다.')
      }
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.')
      console.error('포스트 데이터 로딩 오류:', err)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize, debouncedSearchTerm, selectedCategory])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  useEffect(() => {
    fetchCategoryCounts()
  }, [fetchCategoryCounts])

  // 페이지 이동
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  // 주차 정보 파싱 함수
  const getParkingInfo = (parking: string | boolean) => {
    // boolean 타입 처리 (기존 데이터 호환성)
    if (typeof parking === 'boolean') {
      return parking
        ? { status: '가능', variant: 'default' as const, bgColor: 'bg-green-500/90' }
        : { status: '불가', variant: 'secondary' as const, bgColor: 'bg-red-500/90' }
    }

    // string 타입 처리 (새로운 세분화된 정보)
    const lowerParking = parking.toLowerCase()

    if (lowerParking.includes('불가')) {
      return {
        status: '불가',
        variant: 'secondary' as const,
        bgColor: 'bg-red-500/90',
      }
    } else if (lowerParking.includes('유료')) {
      return {
        status: '유료',
        variant: 'secondary' as const,
        bgColor: 'bg-orange-500/90',
      }
    } else if (lowerParking.includes('무료')) {
      return { status: '무료', variant: 'default' as const, bgColor: 'bg-green-500/90' }
    } else {
      return {
        status: '정보없음',
        variant: 'outline' as const,
        bgColor: 'bg-gray-500/90',
      }
    }
  }

  return (
    <div className='space-y-8'>
      {/* 검색 및 필터 */}
      <div className='flex flex-col lg:flex-row gap-2 items-end justify-between'>
        <div className='flex flex-col sm:flex-row gap-4 items-center w-full lg:w-auto'>
          <div className='relative w-full sm:w-96 font-nanum'>
            <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground' />
            <Input
              placeholder='매장명이나 설명으로 검색해보세요...'
              className='pl-12 h-12 text-base'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className='w-full sm:w-34 h-12 focus:border-primary/50'>
              <SelectValue placeholder='카테고리 선택' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>
                전체 ({Object.values(categoryCounts).reduce((a, b) => a + b, 0)})
              </SelectItem>
              <SelectItem value='domestic'>국내 ({categoryCounts.domestic || 0})</SelectItem>
              <SelectItem value='overseas'>해외 ({categoryCounts.overseas || 0})</SelectItem>
              <SelectItem value='special'>특별매장 ({categoryCounts.special || 0})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {pagination && (
          <div className='text-muted-foreground'>
            총 <span className='text-primary'>{pagination.totalCount}</span>개 매장
          </div>
        )}
      </div>

      {/* 포스트 목록 */}
      {isLoading ? (
        <div className='flex flex-col justify-center items-center py-20'>
          <Loader2 className='h-12 w-12 animate-spin text-primary mb-4' />
          <span className='font-nanum text-muted-foreground'>매장 정보를 불러오는 중...</span>
        </div>
      ) : error ? (
        <div className='bg-destructive/10 border border-destructive/20 p-8 rounded-xl text-destructive text-center'>
          <p className='font-nanum mb-4'>{error}</p>
          <Button onClick={fetchPosts} variant='outline' size='lg' className='font-medium'>
            다시 시도
          </Button>
        </div>
      ) : (
        <>
          {posts.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {posts.map((post) => (
                <Link key={post._id} href={`/posts/${post.slug}`}>
                  <Card className='group overflow-hidden border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 py-0 gap-3'>
                    <div className='relative aspect-[16/11] overflow-hidden'>
                      <Image
                        src={post.storeId?.images?.[0] || post.image || '/placeholder.svg'}
                        alt={post.title}
                        fill
                        className='object-cover'
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      />

                      {/* 주차 정보만 이미지 위에 표시 */}
                      <div className='absolute top-4 right-4'>
                        {(() => {
                          const parkingInfo = getParkingInfo(post.storeId?.parking || false)

                          return (
                            <Badge
                              variant={parkingInfo.variant}
                              className={`${parkingInfo.bgColor} text-white font-medium px-3 py-1 text-xs backdrop-blur-sm border-0 shadow-sm flex items-center gap-1`}
                            >
                              주차 {parkingInfo.status}
                            </Badge>
                          )
                        })()}
                      </div>
                    </div>

                    <CardHeader className='pb-0 gap-0'>
                      <CardTitle className='text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors duration-200 leading-tight pt-3'>
                        {post.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className='px-6 pb-6'>
                      <p className='text-muted-foreground line-clamp-2 text-base leading-relaxed mb-4'>
                        {post.description}
                      </p>

                      {post.storeId?.tags && post.storeId.tags.length > 0 && (
                        <div className='flex flex-wrap gap-2 mb-3 '>
                          {post.storeId.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant='secondary' className='px-2 py-1 text-xs'>
                              #{tag}
                            </Badge>
                          ))}
                          {post.storeId.tags.length > 3 && (
                            <Badge
                              variant='outline'
                              className='text-xs px-2 py-1 bg-gray-50 text-gray-600 border-gray-200'
                            >
                              +{post.storeId.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
                          <Calendar className='h-4 w-4' />
                          <span>
                            {post.storeId?.since
                              ? `개점 ${post.storeId.since}`
                              : formatSimpleDate(post.createdAt)}
                          </span>
                        </div>

                        <div className='flex items-center gap-4'>
                          <div className='flex items-center gap-1 text-sm font-medium text-muted-foreground'>
                            <Eye className='h-4 w-4' />
                            <span>{post.numViews?.toLocaleString() || 0}</span>
                          </div>
                          <div className='flex items-center gap-1 text-sm font-medium text-muted-foreground'>
                            <Heart className='h-4 w-4' />
                            <span>{post.numLikes || 0}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className='text-center py-20 font-nanum'>
              <div className='w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center'>
                <MapPin className='h-12 w-12 text-muted-foreground' />
              </div>
              <h3 className='text-2xl font-bold mb-3'>매장을 찾을 수 없습니다</h3>
              <p className='text-muted-foreground max-w-md mx-auto'>
                {searchTerm || selectedCategory !== 'all'
                  ? '검색 조건을 변경해보시거나 다른 키워드로 검색해보세요.'
                  : '아직 등록된 매장이 없습니다. 곧 새로운 매장들이 추가될 예정입니다.'}
              </p>
            </div>
          )}

          {/* 페이지네이션 */}
          {pagination && pagination.totalPages > 1 && (
            <div className='mt-12 pt-8 border-t'>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href='#'
                      onClick={(e) => {
                        e.preventDefault()
                        if (pagination.hasPrevPage) goToPage(currentPage - 1)
                      }}
                      className={!pagination.hasPrevPage ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>

                  {/* 첫 페이지 */}
                  {currentPage > 3 && (
                    <>
                      <PaginationItem>
                        <PaginationLink
                          href='#'
                          onClick={(e) => {
                            e.preventDefault()
                            goToPage(1)
                          }}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      {currentPage > 4 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                    </>
                  )}

                  {/* 현재 페이지 주변 페이지들 */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const startPage = Math.max(
                      1,
                      Math.min(currentPage - 2, pagination.totalPages - 4)
                    )
                    const pageNumber = startPage + i

                    if (pageNumber > pagination.totalPages) return null

                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href='#'
                          onClick={(e) => {
                            e.preventDefault()
                            goToPage(pageNumber)
                          }}
                          isActive={pageNumber === currentPage}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  {/* 마지막 페이지 */}
                  {currentPage < pagination.totalPages - 2 && (
                    <>
                      {currentPage < pagination.totalPages - 3 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          href='#'
                          onClick={(e) => {
                            e.preventDefault()
                            goToPage(pagination.totalPages)
                          }}
                        >
                          {pagination.totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href='#'
                      onClick={(e) => {
                        e.preventDefault()
                        if (pagination.hasNextPage) goToPage(currentPage + 1)
                      }}
                      className={!pagination.hasNextPage ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  )
}
