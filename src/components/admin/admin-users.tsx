import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { formatDateTime } from '@/lib/utils'
import { IUser } from '@/lib/db/models/user.model'
import { getAllUsersPage } from '@/lib/actions/user.action'
import {
  Baby,
  CheckCircle,
  Eye,
  Loader2,
  Save,
  Search,
  Trash2,
  XCircle,
} from 'lucide-react'
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
import { Pagination } from '@/lib/type'
import AdminPagination from './admin-pagination'
import DialogUserDetail from '../dialog/dialog-user-detail'

export default function AdminUsers() {
  const [users, setUsers] = useState<IUser[]>([])
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
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)

  // 데이터 가져오기
  // const fetchUsers = useCallback(async () => {
  //   setIsLoading(true)
  //   setError(null)

  //   try {
  //     const result = await getAllUsers()
  //     // console.log(result)

  //     if (result.success) {
  //       setUsers(result.users)
  //     } else {
  //       setError(result.error || '회원 목록을 불러오지 못했습니다.')
  //     }
  //   } catch (error) {
  //     console.error(error)
  //     setError('서버 요청 중 오류가 발생했습니다.')
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }, [])

  // 데이터 가져오기(페이지, 검색)
  const fetchUsers = useCallback(async () => {
    setIsLoading(true)

    try {
      const result = await getAllUsersPage(
        currentPage,
        pageSize,
        query || undefined
      )

      if (result.success) {
        setUsers(result.users)
        setPagination(result.pagination!)
        setError(null)
      } else {
        setError(result.error || '회원 목록을 불러오지 못했습니다.')
      }
    } catch (error) {
      console.error(error)
      setError('서버 요청 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize, query])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // 상세정보 보기
  const handleDetailClick = (user: IUser) => {
    setDetailOpen(true)
    setSelectedUser(user)
  }

  // 수정하기
  const handleEditClick = (user: IUser) => {
    console.log('수정하기:', user)
    // TODO: 수정 페이지로 이동
  }

  // 삭제하기
  const handleDeleteClick = (userId: string) => {
    console.log('삭제하기:', userId)
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
            회원 관리({pagination?.totalCount || 0})
          </CardTitle>
          <CardDescription>
            회원을 관리하고 삭제 및 상태 변경을 할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4 mb-4'>
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
              <Button variant='outline' onClick={fetchUsers}>
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
                      <TableHead>이름</TableHead>
                      <TableHead>사용자 이름</TableHead>
                      <TableHead>이메일</TableHead>
                      <TableHead className='text-center'>이메일</TableHead>
                      <TableHead className='text-center'>가입 경로</TableHead>
                      <TableHead className='text-center'>역할</TableHead>
                      <TableHead className='text-center'>상태</TableHead>
                      <TableHead className='text-center'>방문수</TableHead>
                      <TableHead className='text-center'>가입일</TableHead>
                      <TableHead className='text-center'>관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length > 0 ? (
                      users.map((user, index) => {
                        return (
                          <TableRow
                            key={user._id as string}
                            className='text-muted-foreground'
                          >
                            <TableCell className='text-center'>
                              {index + 1}
                            </TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>
                              <Link
                                href={`/@${user.username}`}
                                className='hover:underline underline-offset-4'
                                title={`@${user.username}님 페이지로 이동`}
                                target='_blank'
                                rel='noopener noreferrer'
                              >
                                @{user.username}
                              </Link>
                            </TableCell>
                            <TableCell>
                              <a
                                href={`mailto:${user.email}`}
                                className='hover:underline underline-offset-4'
                                title={`${user.email}로 이메일 보내기`}
                              >
                                {user.email}
                              </a>
                            </TableCell>
                            <TableCell>
                              {user.emailVerified ? (
                                <span
                                  title='이메일 인증 완료'
                                  className='flex items-center justify-center gap-1'
                                >
                                  인증확인
                                  <CheckCircle className='h-4 w-4 text-green-500' />
                                </span>
                              ) : (
                                <span
                                  title='이메일 인증 필요'
                                  className='flex items-center justify-center gap-1'
                                >
                                  인증안됨
                                  <XCircle className='h-4 w-4 text-red-500' />
                                </span>
                              )}
                            </TableCell>
                            <TableCell className='text-center'>
                              {user.provider}
                            </TableCell>
                            <TableCell className='text-center'>
                              {user.role === 'admin' ? (
                                <Badge variant='destructive'>관리자</Badge>
                              ) : (
                                <Badge variant='outline'>사용자</Badge>
                              )}
                            </TableCell>
                            <TableCell className='text-center'>
                              {user.isActive ? (
                                <Badge variant='outline'>활성</Badge>
                              ) : (
                                <Badge variant='destructive'>비활성</Badge>
                              )}
                            </TableCell>
                            <TableCell className='text-center'>
                              {user.visitCount}
                            </TableCell>
                            <TableCell className='text-center'>
                              {formatDateTime(user.createdAt)}
                            </TableCell>
                            <TableCell>
                              <div className='flex items-center justify-center gap-1'>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  title='상세정보'
                                  onClick={() => handleDetailClick(user)}
                                >
                                  <Eye className='h-4 w-4' />
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  title='수정하기'
                                  onClick={() => handleEditClick(user)}
                                >
                                  <Save className='h-4 w-4' />
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  title='삭제하기'
                                  onClick={() =>
                                    handleDeleteClick(
                                      (user._id as string).toString()
                                    )
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
                          colSpan={12}
                          className='text-center py-6 text-muted-foreground'
                        >
                          등록된 글이 없습니다.
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
      <DialogUserDetail
        open={detailOpen}
        onOpenChange={setDetailOpen}
        user={selectedUser}
      />
    </>
  )
}
