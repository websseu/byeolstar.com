'use server'

import { revalidatePath } from 'next/cache'
import { connectToDatabase } from '../db'
import Post from '../db/model/post.model'
import { IPostInput, IPostUpdateInput } from '../type'
import { PostInputSchema, PostUpdateSchema } from '../validator'

// createPost : 글 쓰기
// getAllPosts : 모든 글 가져오기(관리자용)
// deletePost : 글 삭제하기
// getPostById : ID로 글 가져오기

// 글 쓰기
export async function createPost(data: IPostInput) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 입력 데이터 유효성 검사
    const validatedData = PostInputSchema.parse(data)

    // 슬러그 중복 확인
    const existingPost = await Post.findOne({ slug: validatedData.slug })
    if (existingPost) {
      return {
        success: false,
        error: '이미 사용 중인 슬러그입니다. 다른 슬러그를 사용해주세요.',
      }
    }

    // 새 포스트 생성
    const newPost = await Post.create(validatedData)

    // 캐시 갱신
    revalidatePath('/admin/posts')

    return {
      success: true,
      message: '포스트가 성공적으로 작성되었습니다.',
      post: JSON.parse(JSON.stringify(newPost)),
    }
  } catch (error) {
    console.error('포스트 작성 중 오류 발생:', error)

    return {
      success: false,
      error: '포스트 생성 중 오류가 발생했습니다.',
    }
  }
}

// 모든 글 가져오기(관리자용)
export async function getAllPosts() {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 모든 게시글 조회 (isPublished 필터 없이)
    const posts = await Post.find().sort({ createdAt: -1 }).lean()

    // JSON 직렬화
    const serialized = JSON.parse(JSON.stringify(posts))

    return {
      success: true,
      posts: serialized,
    }
  } catch (error) {
    console.error('포스트 목록 조회 중 오류 발생:', error)

    return {
      success: false,
      error: '포스트 목록을 불러오는 중 오류가 발생했습니다.',
    }
  }
}

// 글 삭제
export async function deletePost(postId: string) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 포스트 ID 유효성 검사
    if (!postId) {
      return {
        success: false,
        error: '삭제할 포스트 ID가 필요합니다.',
      }
    }

    // 포스트 존재 확인
    const existingPost = await Post.findById(postId)
    if (!existingPost) {
      return {
        success: false,
        error: '삭제하려는 포스트를 찾을 수 없습니다.',
      }
    }

    // 포스트 삭제
    await Post.findByIdAndDelete(postId)

    // 캐시 갱신
    revalidatePath('/admin/posts')

    return {
      success: true,
      message: '포스트가 성공적으로 삭제되었습니다.',
    }
  } catch (error) {
    console.error('포스트 삭제 중 오류 발생:', error)

    return {
      success: false,
      error: '포스트 삭제 중 오류가 발생했습니다.',
    }
  }
}

// 글 수정
export async function updatePost(data: IPostUpdateInput) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 입력 데이터 유효성 검사
    const validatedData = PostUpdateSchema.parse(data)
    const { id, ...updateData } = validatedData

    // 포스트 존재 확인
    const existingPost = await Post.findById(id)
    if (!existingPost) {
      return {
        success: false,
        error: '수정하려는 포스트를 찾을 수 없습니다.',
      }
    }

    // 슬러그 중복 확인 (자신 제외)
    if (updateData.slug) {
      const duplicatePost = await Post.findOne({
        slug: updateData.slug,
        _id: { $ne: id },
      })
      if (duplicatePost) {
        return {
          success: false,
          error: '이미 사용 중인 슬러그입니다. 다른 슬러그를 사용해주세요.',
        }
      }
    }

    // 포스트 수정 (updatedAt 자동 설정)
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedAt: new Date(),
      },
      { new: true }
    )

    // 캐시 갱신
    revalidatePath('/admin/posts')
    if (updatedPost?.slug) {
      revalidatePath(`/posts/${updatedPost.slug}`)
    }

    return {
      success: true,
      message: '포스트가 성공적으로 수정되었습니다.',
      post: JSON.parse(JSON.stringify(updatedPost)),
    }
  } catch (error) {
    console.error('포스트 수정 중 오류 발생:', error)

    return {
      success: false,
      error: '포스트 수정 중 오류가 발생했습니다.',
    }
  }
}

// ID로 글 가져오기
export async function getPostById(postId: string) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 포스트 ID 유효성 검사
    if (!postId) {
      return {
        success: false,
        error: '포스트 ID가 필요합니다.',
      }
    }

    // 포스트 조회
    const post = await Post.findById(postId).lean()

    if (!post) {
      return {
        success: false,
        error: '포스트를 찾을 수 없습니다.',
      }
    }

    // JSON 직렬화
    const serialized = JSON.parse(JSON.stringify(post))

    return {
      success: true,
      post: serialized,
    }
  } catch (error) {
    console.error('포스트 조회 중 오류 발생:', error)

    return {
      success: false,
      error: '포스트를 불러오는 중 오류가 발생했습니다.',
    }
  }
}
