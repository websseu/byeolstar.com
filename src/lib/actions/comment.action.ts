'use server'

import { revalidatePath } from 'next/cache'
import { CommentInputSchema } from '@/lib/validator'
import { connectToDatabase } from '../db'
import Comments from '../db/model/comment.model'

// createComment : 댓글 만들기
// getAllComments : 댓글 가져오기
// getCommentsPaginated : 댓글 가져오기(페이지네이션/검색 기능 포함)
// deleteComment : 댓글 삭제하기
// restoreComment : 댓글 복원하기

// 댓글 만들기
export async function createComment(data: unknown) {
  try {
    // 입력 데이터 검증
    const validatedData = CommentInputSchema.parse(data)

    // MongoDB 연결
    await connectToDatabase()

    // 댓글 생성 (클라이언트에서 받은 데이터 사용)
    const newComment = await Comments.create({
      postId: validatedData.postId,
      author: validatedData.author,
      content: validatedData.content,
      email: validatedData.email || null,
      isDeleted: false,
    })

    // 해당 게시글 페이지 재검증
    revalidatePath(`/posts/${validatedData.postId}`)

    return {
      success: true,
      message: '댓글이 성공적으로 작성되었습니다.',
      data: {
        id: newComment._id.toString(),
        postId: newComment.postId,
        author: newComment.author,
        content: newComment.content,
        createdAt: newComment.createdAt,
      },
    }
  } catch (error) {
    console.error('댓글 생성 오류:', error)

    // Zod 검증 오류
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        message: '입력 데이터가 올바르지 않습니다.',
        errors: JSON.parse(error.message),
      }
    }

    return {
      success: false,
      message: '댓글 작성 중 오류가 발생했습니다. 다시 시도해주세요.',
    }
  }
}

// 모든 댓글 가져오기 (관리자용)
export async function getAllComments() {
  try {
    await connectToDatabase()

    const comments = await Comments.find({})
      .populate('postId', 'title slug')
      .sort({ createdAt: -1 })
      .lean()

    const serialized = JSON.parse(JSON.stringify(comments))

    return {
      success: true,
      comments: serialized,
    }
  } catch (error) {
    console.error('댓글 목록 조회 중 오류 발생:', error)
    return {
      success: false,
      error: '댓글 목록을 불러오는 중 오류가 발생했습니다.',
    }
  }
}

// 댓글 목록 가져오기 (페이지네이션/검색 기능 포함)
export async function getCommentsPaginated(page = 1, limit = 10, searchQuery?: string) {
  try {
    await connectToDatabase()

    const skip = (page - 1) * limit

    // 검색 조건 설정
    const searchCondition = searchQuery
      ? {
          $or: [
            { author: { $regex: searchQuery, $options: 'i' } },
            { content: { $regex: searchQuery, $options: 'i' } },
            { email: { $regex: searchQuery, $options: 'i' } },
          ],
        }
      : {}

    // 총 개수 조회
    const totalCount = await Comments.countDocuments(searchCondition)

    // 페이지네이션된 데이터 조회
    const comments = await Comments.find(searchCondition)
      .populate('postId', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // 페이지네이션 정보 계산
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return {
      success: true,
      comments: JSON.parse(JSON.stringify(comments)),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage,
      },
    }
  } catch (error) {
    console.error('댓글 조회 오류:', error)
    return {
      success: false,
      error: '댓글 데이터를 불러오는데 실패했습니다.',
    }
  }
}

// 댓글 삭제 (소프트 삭제)
export async function deleteComment(commentId: string) {
  try {
    await connectToDatabase()

    if (!commentId) {
      return {
        success: false,
        error: '삭제할 댓글 ID가 필요합니다.',
      }
    }

    const existingComment = await Comments.findById(commentId)
    if (!existingComment) {
      return {
        success: false,
        error: '삭제하려는 댓글을 찾을 수 없습니다.',
      }
    }

    // 소프트 삭제 (isDeleted를 true로 설정)
    await Comments.findByIdAndUpdate(commentId, {
      isDeleted: true,
      updatedAt: new Date(),
    })

    // 캐시 갱신
    revalidatePath('/admin')

    return {
      success: true,
      message: '댓글이 성공적으로 삭제되었습니다.',
    }
  } catch (error) {
    console.error('댓글 삭제 중 오류 발생:', error)
    return {
      success: false,
      error: '댓글 삭제 중 오류가 발생했습니다.',
    }
  }
}

// 댓글 복원
export async function restoreComment(commentId: string) {
  try {
    await connectToDatabase()

    if (!commentId) {
      return {
        success: false,
        error: '복원할 댓글 ID가 필요합니다.',
      }
    }

    const existingComment = await Comments.findById(commentId)
    if (!existingComment) {
      return {
        success: false,
        error: '복원하려는 댓글을 찾을 수 없습니다.',
      }
    }

    // 댓글 복원 (isDeleted를 false로 설정)
    await Comments.findByIdAndUpdate(commentId, {
      isDeleted: false,
      updatedAt: new Date(),
    })

    // 캐시 갱신
    revalidatePath('/admin')

    return {
      success: true,
      message: '댓글이 성공적으로 복원되었습니다.',
    }
  } catch (error) {
    console.error('댓글 복원 중 오류 발생:', error)
    return {
      success: false,
      error: '댓글 복원 중 오류가 발생했습니다.',
    }
  }
}
