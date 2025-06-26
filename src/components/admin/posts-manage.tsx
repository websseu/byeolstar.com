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
  FileEdit,
  Trash2,
  Eye,
  Loader2,
  X,
  Rss,
  Turtle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { deletePost, getPostsPaginated } from '@/lib/actions/post.action'
import { formatSimpleDate } from '@/lib/utils'
import { toast } from 'sonner'
import DialogPostDelete from '../dialog/dialog-post-delete'

interface Post {
  _id: string
  title: string
  slug: string
  category: string
  components: string
  description: string
  image: string
  isPublished: boolean
  createdAt: string
  numViews: number
  numLikes: number
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export default function PostsManage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)
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
  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true)
      const result = await getPostsPaginated(
        currentPage,
        pageSize,
        debouncedSearchTerm || undefined
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
  }, [currentPage, pageSize, debouncedSearchTerm])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // 페이지 크기 변경
  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(Number(newPageSize))
    setCurrentPage(1)
  }

  // 페이지 이동
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  // 삭제 다이얼로그 열기
  const handleDeleteClick = (post: Post) => {
    setPostToDelete(post)
    setDeleteDialogOpen(true)
  }

  // 삭제 확인
  const handleDeleteConfirm = async () => {
    if (!postToDelete) return

    try {
      setIsDeleting(true)
      const result = await deletePost(postToDelete._id)

      if (result.success) {
        toast.success('삭제 완료', {
          description: result.message,
        })

        // 목록에서 삭제된 포스트 제거
        setPosts((prevPosts) => prevPosts.filter((p) => p._id !== postToDelete._id))

        // 현재 페이지에 데이터가 없으면 이전 페이지로 이동
        if (posts.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        } else {
          fetchPosts()
        }
      } else {
        toast.error('삭제 실패', {
          description: result.error,
        })
      }
    } catch (error) {
      console.error('삭제 중 오류:', error)
      toast.error('삭제 실패', {
        description: '포스트 삭제 중 오류가 발생했습니다.',
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setPostToDelete(null)
    }
  }

  // 다이얼로그 상태 변경
  const handleDialogOpenChange = (open: boolean) => {
    if (!open && !isDeleting) {
      setDeleteDialogOpen(false)
      setPostToDelete(null)
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
              placeholder='글 제목, 카테고리, 설명 검색'
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
              포스트
              {pagination.totalCount > 0 && (
                <span className='ml-2'>
                  ({(currentPage - 1) * pageSize + 1}-
                  {Math.min(currentPage * pageSize, pagination.totalCount)})
                </span>
              )}
            </div>
          )}
        </div>

        <Link href='/admin/posts/create'>
          <Button>글 작성</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center py-8'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <span className='ml-2'>데이터를 불러오는 중...</span>
        </div>
      ) : error ? (
        <div className='bg-destructive/10 p-4 rounded-md text-destructive text-center'>
          <p className='font-medium'>{error}</p>
          <Button onClick={fetchPosts} variant='outline' className='mt-2'>
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
                  <TableHead>제목</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>작성일</TableHead>
                  <TableHead>슬러그</TableHead>
                  <TableHead>컴퍼넌트</TableHead>
                  <TableHead>조회수</TableHead>
                  <TableHead>좋아요</TableHead>
                  <TableHead>관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.length > 0 ? (
                  posts.map((post, index) => (
                    <TableRow key={post._id}>
                      <TableCell className='text-center'>
                        {(currentPage - 1) * pageSize + index + 1}
                      </TableCell>
                      <TableCell className='text-center max-w-[300px] truncate' title={post.title}>
                        {post.title}
                      </TableCell>
                      <TableCell className='max-w-[200px]'>
                        <div className='flex items-start gap-1'>
                          <Rss className='h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0' />
                          <span className='text-sm truncate' title={post.description}>
                            {post.description}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className='text-center'>{post.category}</TableCell>
                      <TableCell className='text-center'>
                        <Badge variant={post.isPublished ? 'default' : 'outline'}>
                          {post.isPublished ? '게시됨' : '임시저장'}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-center'>
                        {formatSimpleDate(post.createdAt)}
                      </TableCell>

                      <TableCell className='max-w-[100px]'>
                        <div className='flex items-start gap-1'>
                          <Turtle className='h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0' />
                          <span className='text-sm truncate' title={post.slug}>
                            {post.slug}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className='text-center'>
                        {post.components?.trim() ? (
                          post.components
                        ) : (
                          <Badge variant='outline'>
                            <X size={16} className='text-red-500' />
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className='text-center'>{post.numViews}</TableCell>
                      <TableCell className='text-center'>{post.numLikes}</TableCell>
                      <TableCell className='text-center'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon'>
                              <MoreVertical className='h-4 w-4' />
                              <span className='sr-only'>메뉴 열기</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <Link href={`/posts/${post.slug}`} target='_blank'>
                              <DropdownMenuItem>
                                <Eye className='h-4 w-4 mx-1' /> 보기
                              </DropdownMenuItem>
                            </Link>
                            <Link href={`/admin/posts/edit/${post._id}`}>
                              <DropdownMenuItem>
                                <FileEdit className='h-4 w-4 mx-1' /> 수정
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                              className='text-destructive focus:text-destructive'
                              onClick={() => handleDeleteClick(post)}
                            >
                              <Trash2 className='h-4 w-4 mx-1 text-red-500' /> 삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} className='text-center py-6 text-muted-foreground'>
                      {searchTerm ? '검색 결과가 없습니다.' : '등록된 게시글이 없습니다.'}
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
      <DialogPostDelete
        open={deleteDialogOpen}
        onOpenChange={handleDialogOpenChange}
        post={postToDelete}
        onDeleteConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  )
}
