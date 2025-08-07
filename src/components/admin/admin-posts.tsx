import React, { useCallback, useEffect, useState } from 'react'
import { Baby, Eye, Loader2, Save, Search, Trash2 } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Pagination } from '@/lib/type'
import { formatDateTime } from '@/lib/utils'
import { IPost } from '@/lib/db/models/post.model'
import { getAllPostsPage } from '@/lib/actions/post.action'
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
import DialogPostDetail from '../dialog/dialog-post-detail'
import DialogPostEdit from '../dialog/dialog-post-edit'

export default function AdminPosts() {
  const [posts, setPosts] = useState<IPost[]>([])
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
  const [detailedPost, setDetailedPost] = useState<IPost | null>(null)

  // 수정하기
  const [editOpen, setEditOpen] = useState(false)
  const [editedPost, setEditedPost] = useState<IPost | null>(null)

  // 데이터 가져오기
  // const fetchPosts = useCallback(async () => {
  //   setIsLoading(true)
  //   setError(null)

  //   try {
  //     const result = await getAllPosts()

  //     if (result.success) {
  //       setPosts(result.posts)
  //     } else {
  //       setError(result.error || '글 목록을 불러오지 못했습니다.')
  //     }
  //   } catch (error) {
  //     console.error(error)
  //     setError('서버 요청 중 오류가 발생했습니다.')
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }, [])

  // 데이터 가져오기(페이지, 검색)
  const fetchPosts = useCallback(async () => {
    setIsLoading(true)

    try {
      const result = await getAllPostsPage(
        currentPage,
        pageSize,
        query || undefined
      )

      if (result.success) {
        setPosts(result.posts)
        setPagination(result.pagination!)
        setError(null)
      } else {
        setError(result.error || '글 목록을 불러오지 못했습니다.')
      }
    } catch (error) {
      console.error(error)
      setError('서버 요청 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize, query])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // 상세정보 보기
  const handleDetailClick = (post: IPost) => {
    setDetailOpen(true)
    setDetailedPost(post)
  }

  // 수정하기
  const handleEditClick = (post: IPost) => {
    setEditOpen(true)
    setEditedPost(post)
  }

  // 게시글 수정 완료 처리(부분로딩)
  const handleEditUpdate = (updatedPost: IPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    )
  }

  // 삭제하기
  const handleDeleteClick = (postId: string) => {
    console.log('삭제하기:', postId)
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
            글 관리({pagination?.totalCount || 0})
          </CardTitle>
          <CardDescription>
            글을 관리하고 삭제 및 상태 변경을 할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-start justify-between mb-4'>
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
                글 작성하기
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
              <Button variant='outline' onClick={fetchPosts}>
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
                      <TableHead>제목</TableHead>
                      <TableHead>슬러그</TableHead>
                      <TableHead>스토어ID</TableHead>
                      <TableHead className='text-center'>상태</TableHead>
                      <TableHead className='text-center'>조회수</TableHead>
                      <TableHead className='text-center'>좋아요</TableHead>
                      <TableHead className='text-center'>즐겨찾기</TableHead>
                      <TableHead className='text-center'>댓글수</TableHead>
                      <TableHead className='text-center'>작성일</TableHead>
                      <TableHead className='text-center'>수정일</TableHead>
                      <TableHead className='text-center'>관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.length > 0 ? (
                      posts.map((post, index) => {
                        return (
                          <TableRow
                            key={post.slug}
                            className='text-muted-foreground'
                          >
                            <TableCell className='text-center'>
                              {(currentPage - 1) * pageSize + index + 1}
                            </TableCell>
                            <TableCell>{post.title}</TableCell>
                            <TableCell>{post.slug}</TableCell>
                            <TableCell>{post.storeId || '-'}</TableCell>
                            <TableCell className='text-center'>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  post.isPublished
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {post.isPublished ? '공개' : '비공개'}
                              </span>
                            </TableCell>
                            <TableCell className='text-center'>
                              {post.numViews || 0}
                            </TableCell>
                            <TableCell className='text-center'>
                              {post.numLikes || 0}
                            </TableCell>
                            <TableCell className='text-center'>
                              {post.numFavorites || 0}
                            </TableCell>
                            <TableCell className='text-center'>
                              {post.numComments || 0}
                            </TableCell>
                            <TableCell className='text-center'>
                              {formatDateTime(post.createdAt)}
                            </TableCell>
                            <TableCell className='text-center'>
                              {formatDateTime(post.updatedAt)}
                            </TableCell>
                            <TableCell>
                              <div className='flex items-center justify-center gap-1'>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  title='상세정보'
                                  onClick={() => handleDetailClick(post)}
                                >
                                  <Eye className='h-4 w-4' />
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  title='수정하기'
                                  onClick={() => handleEditClick(post)}
                                >
                                  <Save className='h-4 w-4' />
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  title='삭제하기'
                                  onClick={() =>
                                    handleDeleteClick(
                                      (post._id as string).toString()
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
      <DialogPostDetail
        open={detailOpen}
        onOpenChange={setDetailOpen}
        post={detailedPost}
      />

      {/* 수정하기 다이얼로그 */}
      <DialogPostEdit
        open={editOpen}
        onOpenChange={setEditOpen}
        post={editedPost}
        onSuccess={handleEditUpdate}
      />
    </>
  )
}
