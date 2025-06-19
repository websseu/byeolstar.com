import { getPostById } from '@/lib/actions/post.action'
import { notFound } from 'next/navigation'
import PostEditForm from '@/components/post/post-edit'

interface EditPostPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params
  const result = await getPostById(id)

  if (!result.success || !result.post) {
    notFound()
  }

  return (
    <section>
      <h1 className='text-xl text-center font-nanum mb-12'>글 수정하기</h1>
      <PostEditForm post={result.post} />
    </section>
  )
}
