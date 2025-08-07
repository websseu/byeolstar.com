import React, { useCallback, useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Pagination } from '@/lib/type'
import { formatDateTime, getStatusBadge } from '@/lib/utils'
import { IContact } from '@/lib/db/models/contact.model'
import { getAllContactsPage } from '@/lib/actions/contact.action'
import { Baby, Eye, Loader2, Search, Trash2 } from 'lucide-react'
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
import DialogContactDetail from '../dialog/dialog-contact-detail'

export default function AdminContacts() {
  const [contacts, setContacts] = useState<IContact[]>([])
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
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null)

  // 데이터 가져오기
  // const fetchContacts = useCallback(async () => {
  //   setIsLoading(true)
  //   setError(null)

  //   try {
  //     const result = await getAllContacts()
  //     // console.log(result)

  //     if (result.success) {
  //       setContacts(result.contacts)
  //     } else {
  //       setError(result.error || '문의사항 목록을 불러오지 못했습니다.')
  //     }
  //   } catch (error) {
  //     console.error(error)
  //     setError('서버 요청 중 오류가 발생했습니다.')
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }, [])

  // 데이터 가져오기(페이지, 검색)
  const fetchContacts = useCallback(async () => {
    setIsLoading(true)

    try {
      const result = await getAllContactsPage(
        currentPage,
        pageSize,
        query || undefined
      )

      if (result.success) {
        setContacts(result.contacts)
        setPagination(result.pagination!)
        setError(null)
      } else {
        setError(result.error || '문의사항 목록을 불러오지 못했습니다.')
      }
    } catch (error) {
      console.error(error)
      setError('서버 요청 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize, query])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  // 상태별 통계 계산
  const getStatusCounts = () => {
    return {
      waiting: contacts.filter((c) => c.status === '대기중').length,
      confirmed: contacts.filter((c) => c.status === '확인완료').length,
      replied: contacts.filter((c) => c.status === '답장완료').length,
    }
  }
  const statusCounts = getStatusCounts()

  // 상세정보 보기
  const handleDetailClick = (contact: IContact) => {
    setDetailOpen(true)
    setSelectedContact(contact)
  }

  // 수정하기
  const handleEditClick = (contact: IContact) => {
    console.log('수정하기:', contact)
    // TODO: 수정 페이지로 이동
  }

  // 삭제하기
  const handleDeleteClick = (contactId: string) => {
    console.log('삭제하기:', contactId)
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
            문의사항 관리({pagination?.totalCount || 0})
          </CardTitle>
          <CardDescription>
            문의사항을 관리하고 삭제 및 상태 변경을 할 수 있습니다.
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
            </div>
            <div>
              {/* 상태 뱃지 영역 */}
              <div className='flex items-center gap-2 justify-end mt-2'>
                <Badge
                  variant='outline'
                  className='text-orange-600 border-orange-600 h-6'
                >
                  대기중: {statusCounts.waiting}
                </Badge>
                <Badge
                  variant='outline'
                  className='text-blue-600 border-blue-600 h-6'
                >
                  확인완료: {statusCounts.confirmed}
                </Badge>
                <Badge
                  variant='outline'
                  className='text-green-600 border-green-600 h-6'
                >
                  답장완료: {statusCounts.replied}
                </Badge>
              </div>
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
              <Button variant='outline' onClick={fetchContacts}>
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
                      <TableHead>이메일</TableHead>
                      <TableHead>내용</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>접수일</TableHead>
                      <TableHead className='text-center'>관리</TableHead>
                      <TableHead className='text-center'>변경</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.length > 0 ? (
                      contacts.map((contact, index) => {
                        const statusInfo = getStatusBadge(contact.status)
                        const StatusIcon = statusInfo.icon

                        return (
                          <TableRow
                            key={contact._id as string}
                            className='text-muted-foreground'
                          >
                            <TableCell className='text-center'>
                              {index + 1}
                            </TableCell>
                            <TableCell>{contact.email}</TableCell>
                            <TableCell>
                              {contact.message.length > 40
                                ? `${contact.message.substring(0, 40)}...`
                                : contact.message}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={statusInfo.variant}
                                className={`${statusInfo.color}`}
                              >
                                <StatusIcon className='h-3 w-3' />
                                {contact.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {formatDateTime(contact.createdAt)}
                            </TableCell>
                            <TableCell>
                              <div className='flex items-center justify-center gap-1'>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  title='상세정보'
                                  onClick={() => handleDetailClick(contact)}
                                >
                                  <Eye className='h-4 w-4' />
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  title='삭제하기'
                                  onClick={() =>
                                    handleDeleteClick(
                                      (contact._id as string).toString()
                                    )
                                  }
                                >
                                  <Trash2 className='h-4 w-4' />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Select value={contact.status}>
                                <SelectTrigger className='w-28 h-6 mx-auto text-sm'>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value='대기중'>대기중</SelectItem>
                                  <SelectItem value='확인완료'>
                                    확인완료
                                  </SelectItem>
                                  <SelectItem value='답장완료'>
                                    답장완료
                                  </SelectItem>
                                </SelectContent>
                              </Select>
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
                          등록된 문의사항이 없습니다.
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

      {/* 상세정보 모달 */}
      <DialogContactDetail
        open={detailOpen}
        onOpenChange={setDetailOpen}
        contact={selectedContact}
      />
    </>
  )
}
