'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  MoreVertical,
  UserX,
  Loader2,
  Shield,
  ShieldOff,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import {
  deleteUser,
  getUsersPaginated,
  toggleUserRole,
  toggleUserStatus,
} from '@/lib/actions/user.action'
import { formatDateTime } from '@/lib/utils'
import { toast } from 'sonner'
import DialogUserDelete from '../dialog/dialog-user-delete'

interface User {
  _id: string
  name: string
  email: string
  role?: string
  visitCount: number
  isActive: boolean
  emailVerified: boolean
  createdAt: string
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export default function UsersManage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1) // 검색 시 첫 페이지로 이동
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // 데이터 가져오기
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      const result = await getUsersPaginated(
        currentPage,
        pageSize,
        debouncedSearchTerm || undefined
      )

      if (result.success) {
        setUsers(result.users)
        setPagination(result.pagination!)
        setError(null)
      } else {
        setError(result.error || '데이터를 불러오는데 실패했습니다.')
      }
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.')
      console.error('사용자 데이터 로딩 오류:', err)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize, debouncedSearchTerm])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // 페이지 크기 변경
  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(Number(newPageSize))
    setCurrentPage(1)
  }

  // 페이지 이동
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  // 사용자 상태 토글
  const handleToggleStatus = async (user: User) => {
    try {
      const result = await toggleUserStatus(user._id)

      if (result.success) {
        toast.success('상태 변경 완료', {
          description: result.message,
        })

        // 목록에서 해당 사용자의 상태 업데이트
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u._id === user._id ? { ...u, isActive: result.isActive! } : u))
        )
      } else {
        toast.error('상태 변경 실패', {
          description: result.error,
        })
      }
    } catch (error) {
      console.error('상태 변경 중 오류:', error)
      toast.error('상태 변경 실패', {
        description: '사용자 상태 변경 중 오류가 발생했습니다.',
      })
    }
  }

  // 사용자 역할 토글
  const handleToggleRole = async (user: User) => {
    try {
      const result = await toggleUserRole(user._id)

      if (result.success) {
        toast.success('역할 변경 완료', {
          description: result.message,
        })

        // 목록에서 해당 사용자의 역할 업데이트
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u._id === user._id ? { ...u, role: result.role! } : u))
        )
      } else {
        toast.error('역할 변경 실패', {
          description: result.error,
        })
      }
    } catch (error) {
      console.error('역할 변경 중 오류:', error)
      toast.error('역할 변경 실패', {
        description: '사용자 역할 변경 중 오류가 발생했습니다.',
      })
    }
  }

  // 삭제 다이얼로그 열기
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  // 삭제 확인
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return

    try {
      setIsDeleting(true)
      const result = await deleteUser(userToDelete._id)

      if (result.success) {
        toast.success('삭제 완료', {
          description: result.message,
        })

        // 목록에서 삭제된 사용자 제거
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userToDelete._id))

        // 현재 페이지에 데이터가 없으면 이전 페이지로 이동
        if (users.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        } else {
          fetchUsers()
        }
      } else {
        toast.error('삭제 실패', {
          description: result.error,
        })
      }
    } catch (error) {
      console.error('삭제 중 오류:', error)
      toast.error('삭제 실패', {
        description: '사용자 삭제 중 오류가 발생했습니다.',
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  // 다이얼로그 상태 변경
  const handleDialogOpenChange = (open: boolean) => {
    if (!open && !isDeleting) {
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  // 페이지네이션 버튼 생성
  const renderPaginationButtons = () => {
    if (!pagination) return null

    const buttons = []
    const { currentPage, totalPages } = pagination

    // 이전 페이지들
    const startPage = Math.max(1, currentPage - 2)
    const endPage = Math.min(totalPages, currentPage + 2)

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? 'default' : 'outline'}
          size='sm'
          onClick={() => goToPage(i)}
          className='w-8 h-8 p-0'
        >
          {i}
        </Button>
      )
    }

    return buttons
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <div className='relative w-64'>
            <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='이름, 이메일, 역할 검색'
              className='pl-9'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className='w-24'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='10'>10개</SelectItem>
              <SelectItem value='20'>20개</SelectItem>
              <SelectItem value='50'>50개</SelectItem>
            </SelectContent>
          </Select>

          {pagination && (
            <div className='text-sm text-muted-foreground'>
              총 <span className='font-semibold text-foreground'>{pagination.totalCount}</span>명
              사용자
              {pagination.totalCount > 0 && (
                <span className='ml-2'>
                  ({(currentPage - 1) * pageSize + 1}-
                  {Math.min(currentPage * pageSize, pagination.totalCount)})
                </span>
              )}
            </div>
          )}
        </div>

        <div className='flex gap-2'>
          <Button onClick={fetchUsers} variant='outline' disabled={isLoading}>
            {isLoading ? <Loader2 className='h-4 w-4 animate-spin mr-2' /> : null}
            새로고침
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center py-8'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <span className='ml-2'>데이터를 불러오는 중...</span>
        </div>
      ) : error ? (
        <div className='bg-destructive/10 p-4 rounded-md text-destructive text-center'>
          <p className='font-medium'>{error}</p>
          <Button onClick={fetchUsers} variant='outline' className='mt-2'>
            다시 시도
          </Button>
        </div>
      ) : (
        <>
          <div className='rounded border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[60px]'>번호</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>역할</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>가입일</TableHead>
                  <TableHead>방문</TableHead>
                  <TableHead>관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <TableRow key={user._id}>
                      <TableCell className='text-center'>
                        {(currentPage - 1) * pageSize + index + 1}
                      </TableCell>
                      <TableCell className='font-medium'>{user.name}</TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <span>{user.email}</span>
                          {user.emailVerified ? (
                            <span title='이메일 인증 완료'>
                              <CheckCircle className='h-4 w-4 text-green-500' />
                            </span>
                          ) : (
                            <span title='이메일 인증 필요'>
                              <XCircle className='h-4 w-4 text-red-500' />
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className='text-center'>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role || '사용자'}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-center'>
                        <Badge
                          variant={user.isActive ? 'default' : 'outline'}
                          className='cursor-pointer hover:opacity-80 transition-opacity'
                          onClick={() => handleToggleStatus(user)}
                          title='클릭하여 상태 변경'
                        >
                          {user.isActive ? '활성' : '비활성'}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-center'>
                        {formatDateTime(user.createdAt)}
                      </TableCell>
                      <TableCell className='text-center'>{user.visitCount}</TableCell>
                      <TableCell className='text-center'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon'>
                              <MoreVertical className='h-4 w-4' />
                              <span className='sr-only'>메뉴 열기</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                              {user.isActive ? (
                                <>
                                  <ShieldOff className='h-4 w-4 mx-1' />
                                  비활성화
                                </>
                              ) : (
                                <>
                                  <Shield className='h-4 w-4 mx-1' />
                                  활성화
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleRole(user)}>
                              {user.role === 'admin' ? (
                                <>
                                  <UserX className='h-4 w-4 mx-1' />
                                  일반 사용자로 변경
                                </>
                              ) : (
                                <>
                                  <Shield className='h-4 w-4 mx-1' />
                                  관리자로 변경
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className='text-destructive'
                              onClick={() => handleDeleteClick(user)}
                            >
                              <UserX className='h-4 w-4 mx-1 text-red-500' /> 삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className='text-center py-6 text-muted-foreground'>
                      {searchTerm ? '검색 결과가 없습니다.' : '등록된 사용자가 없습니다.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* 페이지네이션 */}
          {pagination && pagination.totalPages > 1 && (
            <div className='flex items-center justify-between'>
              <div className='text-sm text-muted-foreground'>
                페이지 {pagination.currentPage} / {pagination.totalPages}
              </div>

              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => goToPage(1)}
                  disabled={!pagination.hasPrevPage}
                  className='w-8 h-8 p-0'
                >
                  <ChevronsLeft className='h-4 w-4' />
                </Button>

                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className='w-8 h-8 p-0'
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button>

                <div className='flex gap-1'>{renderPaginationButtons()}</div>

                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className='w-8 h-8 p-0'
                >
                  <ChevronRight className='h-4 w-4' />
                </Button>

                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => goToPage(pagination.totalPages)}
                  disabled={!pagination.hasNextPage}
                  className='w-8 h-8 p-0'
                >
                  <ChevronsRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* 삭제 확인 다이얼로그 */}
      <DialogUserDelete
        open={deleteDialogOpen}
        onOpenChange={handleDialogOpenChange}
        user={userToDelete}
        onDeleteConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  )
}
