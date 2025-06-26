import React from 'react'
import PostCreateForm from '@/components/post/post-create'

export default function CreatePostPage() {
  return (
    <section>
      <h1 className='text-xl text-center font-nanum mb-12'>글 작성하기</h1>
      <PostCreateForm />
    </section>
  )
}
