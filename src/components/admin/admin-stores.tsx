import React, { useCallback, useEffect, useState } from 'react'
import { Baby, Eye, Loader2, Save, Search, Trash2 } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Pagination } from '@/lib/type'
import { IStore } from '@/lib/db/models/store.model'
import { getAllStoresPage } from '@/lib/actions/store.action'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import AdminPagination from './admin-pagination'
import DialogStoreDetail from '../dialog/dialog-store-detail'

export default function AdminStores() {
  const [stores, setStores] = useState<IStore[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 검색 및 페이지네이션
  const [searchTerm, setSearchTerm] = useState('')
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pagination, setPagination] = useState<Pagination | null>(null)

  // 상세정보
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState<IStore | null>(null)

  // 데이터 가져오기
  // const fetchStores = useCallback(async () => {
  //   setIsLoading(true)
  //   setError(null)

  //   try {
  //     const result = await getAllStores()
  //     console.log(result)

  //     if (result.success) {
  //       setStores(result.stores)
  //     } else {
  //       setError(result.error || '스토어 목록을 불러오지 못했습니다.')
  //     }
  //   } catch (error) {
  //     console.error(error)
  //     setError('서버 요청 중 오류가 발생했습니다.')
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }, [])

  // 데이터 가져오기(페이지, 검색)
  const fetchStores = useCallback(async () => {
    setIsLoading(true)

    try {
      const result = await getAllStoresPage(
        currentPage,
        pageSize,
        query || undefined
      )

      if (result.success) {
        setStores(result.stores)
        setPagination(result.pagination!)
        setError(null)
      } else {
        setError(result.error || '스토어 목록을 불러오지 못했습니다.')
      }
    } catch (error) {
      console.error(error)
      setError('서버 요청 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize, query])

  useEffect(() => {
    fetchStores()
  }, [fetchStores])

  // 상세정보 보기
  const handleDetailClick = (store: IStore) => {
    setDetailOpen(true)
    setSelectedStore(store)
  }

  // 수정하기
  const handleEditClick = (store: IStore) => {
    console.log('수정하기:', store)
    // TODO: 수정 페이지로 이동
  }

  // 삭제하기
  const handleDeleteClick = (storeId: string) => {
    console.log('삭제하기:', storeId)
    // TODO: 삭제 확인 후 처리
  }

  // 페이지 사이즈
  const pageSizeChange = (newPageSize: string) => {
    setPageSize(Number(newPageSize))
    setCurrentPage(1)
  }

  // 검색 처리
  const handleSearch = () => {
    setCurrentPage(1)
    setQuery(searchTerm)
  }

  // 검색 엔터
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // 페이지 이동
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <>
      <Card className='mb-20'>
        <CardHeader>
          <CardTitle className='text-xl font-gmarket text-green-700 flex items-center gap-2'>
            스토어 관리({pagination?.totalCount || 0})
          </CardTitle>
          <CardDescription>
            스토어를 관리하고 삭제 및 상태 변경을 할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4 flex items-start justify-between'>
            <div className='flex gap-2'>
              {/* 검색영역 */}
              <div className='relative w-full sm:w-80 flex gap-2'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='검색어를 입력해주세요.'
                  className='pl-9 h-10'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
                <Button
                  variant='outline'
                  onClick={handleSearch}
                  className='h-10 px-4'
                >
                  검색
                </Button>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              {/* 글 갯수 설정 */}
              <Select
                value={pageSize.toString()}
                onValueChange={pageSizeChange}
              >
                <SelectTrigger className='w-24 py-[19px] text-muted-foreground'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='10'>10개</SelectItem>
                  <SelectItem value='20'>20개</SelectItem>
                  <SelectItem value='50'>50개</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-green-700 hover:bg-green-800 h-10'>
                스토어 작성하기
              </Button>
            </div>
          </div>

          {/* 검색 결과 표시 */}
          {query && (
            <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded'>
              <p className='text-sm text-blue-800 font-medium'>
                <span className='font-bold'>&ldquo;{query}&rdquo;</span>{' '}
                검색어로{' '}
                <span className='font-bold text-blue-600'>
                  {pagination?.totalCount || 0}개
                </span>
                가 검색되었습니다.
              </p>
            </div>
          )}

          {isLoading ? (
            <div className='flex justify-center items-center py-20 mt-8'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <span className='ml-2'>데이터를 불러오는 중...</span>
            </div>
          ) : error ? (
            <div className='p-4 text-center py-20 mt-8 border-t'>
              <Baby className='w-16 h-16 mx-auto text-gray-400 mb-4' />
              <h1 className='text-3xl font-bold mb-2 text-gray-800'>
                에러가 발생했어요
              </h1>
              <p className='text-red-600 mb-6 text-center font-nanum text-sm'>
                {error}
              </p>
              <Button variant='outline' onClick={fetchStores}>
                다시 시도
              </Button>
            </div>
          ) : (
            <>
              <div className='rounded border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='text-center'>번호</TableHead>
                      <TableHead>매장명</TableHead>
                      <TableHead>스토어ID</TableHead>
                      <TableHead>주소</TableHead>
                      <TableHead>태그</TableHead>
                      <TableHead>서비스</TableHead>
                      <TableHead>편의시설</TableHead>
                      <TableHead className='text-center'>관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stores.length > 0 ? (
                      stores.map((store, index) => {
                        return (
                          <TableRow
                            key={store.storeId}
                            className='text-muted-foreground'
                          >
                            <TableCell className='text-center'>
                              {index + 1}
                            </TableCell>
                            <TableCell>{store.name}</TableCell>
                            <TableCell>{store.storeId}</TableCell>
                            <TableCell>{store.address}</TableCell>
                            <TableCell>
                              {store.tags?.length > 0 ? (
                                <div className='flex items-center gap-1'>
                                  <span className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full'>
                                    {store.tags[0]}
                                  </span>
                                  {store.tags.length > 1 && (
                                    <span className='text-xs text-gray-500'>
                                      +{store.tags.length - 1}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell>
                              {store.services?.length > 0 ? (
                                <div className='flex items-center gap-1'>
                                  <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>
                                    {store.services[0]}
                                  </span>
                                  {store.services.length > 1 && (
                                    <span className='text-xs text-gray-500'>
                                      +{store.services.length - 1}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell>
                              {store.facilities?.length > 0 ? (
                                <div className='flex items-center gap-1'>
                                  <span className='px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full'>
                                    {store.facilities[0]}
                                  </span>
                                  {store.facilities.length > 1 && (
                                    <span className='text-xs text-gray-500'>
                                      +{store.facilities.length - 1}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell>
                              <div className='flex items-center justify-center gap-1'>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  title='상세정보'
                                  onClick={() => handleDetailClick(store)}
                                >
                                  <Eye className='h-4 w-4' />
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  title='수정하기'
                                  onClick={() => handleEditClick(store)}
                                >
                                  <Save className='h-4 w-4' />
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  title='삭제하기'
                                  onClick={() =>
                                    handleDeleteClick(store.storeId)
                                  }
                                >
                                  <Trash2 className='h-4 w-4' />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className='text-center py-6 text-muted-foreground'
                        >
                          등록된 스토어가 없습니다.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* 페이지네이션 */}
              <AdminPagination
                pagination={pagination}
                currentPage={currentPage}
                onPageChange={goToPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* 상세정보 다이얼로그 */}
      <DialogStoreDetail
        open={detailOpen}
        onOpenChange={setDetailOpen}
        store={selectedStore}
      />
    </>
  )
}
