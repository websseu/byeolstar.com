import React, { useEffect, useState } from 'react'
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
import { Search, MoreVertical, FileEdit, Trash2, Eye, Loader2 } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { deletePost, getAllPosts } from '@/lib/actions/post.action'
import { formatDateTime } from '@/lib/utils'
import { toast } from 'sonner'
import DialogPostDelete from '../dialog/dialog-post-delete'

interface Post {
  _id: string
  title: string
  slug: string
  category: string
  author: string
  isPublished: boolean
  createdAt: string
  numviews: number
}

export default function PostsManage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // 데이터 가져오기
  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const result = await getAllPosts()

      if (result.success) {
        setPosts(result.posts)
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
  }

  useEffect(() => {
    fetchPosts()
  }, [])

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
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postToDelete._id))
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

  // 검색 기능
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.author && post.author.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className='space-y-4'>
      <div className='flex justify-between'>
        <div className='relative w-64'>
          <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='글 제목, 카테고리 검색'
            className='pl-9'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
        <div className='bg-destructive/10 p-4 rounded-md text-destructive text-center'>{error}</div>
      ) : (
        <div className='rounded border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[60px]'>번호</TableHead>
                <TableHead>제목</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>작성자</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>작성일</TableHead>
                <TableHead>조회수</TableHead>
                <TableHead>관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
                  <TableRow key={post._id}>
                    <TableCell className='text-center'>{index + 1}</TableCell>
                    <TableCell className='max-w-[300px] truncate' title={post.title}>
                      {post.title}
                    </TableCell>
                    <TableCell className='text-center'>{post.category}</TableCell>
                    <TableCell className='text-center'>{post.author || '작성자 없음'}</TableCell>
                    <TableCell className='text-center'>
                      <Badge variant={post.isPublished ? 'default' : 'outline'}>
                        {post.isPublished ? '게시됨' : '임시저장'}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-center'>{formatDateTime(post.createdAt)}</TableCell>
                    <TableCell className='text-center'>{post.numviews}</TableCell>
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
                            className='text-destructive'
                            onClick={() => handleDeleteClick(post)}
                          >
                            <Trash2 className='h-4 w-4 mx-1' /> 삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className='text-center py-6 text-muted-foreground'>
                    {searchTerm ? '검색 결과가 없습니다.' : '등록된 게시글이 없습니다.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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
