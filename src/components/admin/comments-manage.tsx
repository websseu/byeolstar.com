'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
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
  Trash2,
  Loader2,
  Eye,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { getCommentsPaginated, deleteComment, restoreComment } from '@/lib/actions/comment.action'
import { formatDateTime } from '@/lib/utils'
import { toast } from 'sonner'

interface Comment {
  _id: string
  postId: {
    _id: string
    title: string
    slug: string
  }
  author: string
  content: string
  email?: string
  isDeleted: boolean
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

export default function CommentsManage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)

  const [isDeleting, setIsDeleting] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)

  // 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1) // 검색 시 첫 페이지로 이동
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // 데이터 가져오기
  const fetchComments = useCallback(async () => {
    try {
      setIsLoading(true)
      const result = await getCommentsPaginated(
        currentPage,
        pageSize,
        debouncedSearchTerm || undefined
      )

      if (result.success) {
        setComments(result.comments)
        setPagination(result.pagination!)
        setError(null)
      } else {
        setError(result.error || '데이터를 불러오는데 실패했습니다.')
      }
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.')
      console.error('댓글 데이터 로딩 오류:', err)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize, debouncedSearchTerm])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  // 페이지 크기 변경
  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(Number(newPageSize))
    setCurrentPage(1)
  }

  // 페이지 이동
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  // 댓글 삭제
  const handleDeleteComment = async (comment: Comment) => {
    try {
      setIsDeleting(true)
      const result = await deleteComment(comment._id)

      if (result.success) {
        toast.success('삭제 완료', {
          description: result.message,
        })

        // 목록에서 댓글 상태 업데이트
        setComments((prevComments) =>
          prevComments.map((c) => (c._id === comment._id ? { ...c, isDeleted: true } : c))
        )
      } else {
        toast.error('삭제 실패', {
          description: result.error,
        })
      }
    } catch (error) {
      console.error('삭제 중 오류:', error)
      toast.error('삭제 실패', {
        description: '댓글 삭제 중 오류가 발생했습니다.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // 댓글 복원
  const handleRestoreComment = async (comment: Comment) => {
    try {
      setIsRestoring(true)
      const result = await restoreComment(comment._id)

      if (result.success) {
        toast.success('복원 완료', {
          description: result.message,
        })

        // 목록에서 댓글 상태 업데이트
        setComments((prevComments) =>
          prevComments.map((c) => (c._id === comment._id ? { ...c, isDeleted: false } : c))
        )
      } else {
        toast.error('복원 실패', {
          description: result.error,
        })
      }
    } catch (error) {
      console.error('복원 중 오류:', error)
      toast.error('복원 실패', {
        description: '댓글 복원 중 오류가 발생했습니다.',
      })
    } finally {
      setIsRestoring(false)
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

  // 상태별 통계 계산
  const getStatusCounts = () => {
    return {
      active: comments.filter((c) => !c.isDeleted).length,
      deleted: comments.filter((c) => c.isDeleted).length,
    }
  }

  const statusCounts = getStatusCounts()

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <div className='relative w-64'>
            <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='작성자, 내용, 이메일 검색'
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
              총 <span className='font-semibold text-foreground'>{pagination.totalCount}</span>개
              댓글
              {pagination.totalCount > 0 && (
                <span className='ml-2'>
                  ({(currentPage - 1) * pageSize + 1}-
                  {Math.min(currentPage * pageSize, pagination.totalCount)})
                </span>
              )}
            </div>
          )}
        </div>

        <div className='flex items-center gap-2'>
          <Badge variant='outline' className='text-green-600 h-6'>
            활성: {statusCounts.active}
          </Badge>
          <Badge variant='outline' className='text-red-600 h-6'>
            삭제됨: {statusCounts.deleted}
          </Badge>
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
          <Button onClick={fetchComments} variant='outline' className='mt-2'>
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
                  <TableHead>작성자</TableHead>
                  <TableHead>댓글 내용</TableHead>
                  <TableHead>게시글</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>작성일</TableHead>
                  <TableHead>관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <TableRow key={comment._id}>
                      <TableCell className='text-center'>
                        {(currentPage - 1) * pageSize + index + 1}
                      </TableCell>
                      <TableCell>
                        <div className='space-y-1'>
                          <div className='font-medium'>{comment.author}</div>
                          {comment.email && (
                            <div className='text-sm text-muted-foreground'>{comment.email}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className='max-w-[300px]'>
                        <div
                          className={`truncate ${
                            comment.isDeleted ? 'line-through text-muted-foreground' : ''
                          }`}
                          title={comment.content}
                        >
                          {comment.content}
                        </div>
                      </TableCell>
                      <TableCell>
                        {comment.postId ? (
                          <Link
                            href={`/posts/${comment.postId.slug}`}
                            target='_blank'
                            className='hover:underline underline-offset-4 text-blue-600'
                            title={comment.postId.title}
                          >
                            <div className='max-w-[200px] truncate'>{comment.postId.title}</div>
                          </Link>
                        ) : (
                          <span className='text-muted-foreground'>삭제된 게시글</span>
                        )}
                      </TableCell>
                      <TableCell className='text-center'>
                        <Badge variant={comment.isDeleted ? 'destructive' : 'default'}>
                          {comment.isDeleted ? '삭제됨' : '활성'}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-center'>
                        {formatDateTime(comment.createdAt)}
                      </TableCell>
                      <TableCell className='text-center'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon'>
                              <MoreVertical className='h-4 w-4' />
                              <span className='sr-only'>메뉴 열기</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            {comment.postId && (
                              <Link href={`/posts/${comment.postId.slug}`} target='_blank'>
                                <DropdownMenuItem>
                                  <Eye className='h-4 w-4' />
                                  게시글 보기
                                </DropdownMenuItem>
                              </Link>
                            )}
                            {comment.isDeleted ? (
                              <DropdownMenuItem
                                onClick={() => handleRestoreComment(comment)}
                                disabled={isRestoring}
                              >
                                <RotateCcw className='h-4 w-4' />
                                복원
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className='text-destructive'
                                onClick={() => handleDeleteComment(comment)}
                                disabled={isDeleting}
                              >
                                <Trash2 className='h-4 w-4 text-red-500' />
                                삭제
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className='text-center py-6 text-muted-foreground'>
                      {searchTerm ? '검색 결과가 없습니다.' : '등록된 댓글이 없습니다.'}
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
    </div>
  )
}
