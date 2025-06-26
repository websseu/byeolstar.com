import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'
import { busanPostsData } from '../posts/busan-posts'
import { busanStoresData } from '../posts/busan-stores'
import { connectToDatabase } from '@/lib/db'
import Post from '@/lib/db/model/post.model'
import Store from '@/lib/db/model/store.model'

loadEnvConfig(cwd())

const main = async () => {
  try {
    const busanPost = busanPostsData
    const busanStore = busanStoresData.item

    await connectToDatabase(process.env.MONGODB_URI)

    // 기존 데이터 삭제
    await Post.deleteMany()
    await Store.deleteMany()

    // 1. 먼저 Store 데이터 삽입
    const createdStores = await Store.insertMany(busanStore)
    console.log(`${createdStores.length}개의 매장이 생성되었습니다.`)

    // 2. storeId를 ObjectId로 매핑하는 맵 생성
    const storeIdMap = new Map()
    createdStores.forEach((store) => {
      storeIdMap.set(store.storeId, store._id)
    })

    // 3. Post 데이터의 storeId를 ObjectId로 변환
    const postsWithObjectId = busanPost.map((post) => ({
      ...post,
      storeId: storeIdMap.get(post.storeId) || null, // String storeId를 ObjectId로 변환
    }))

    // 4. Post 데이터 삽입
    const createdPosts = await Post.insertMany(postsWithObjectId)
    console.log(`${createdPosts.length}개의 포스트가 생성되었습니다.`)

    console.log({
      stores: createdStores.length,
      posts: createdPosts.length,
      message: '데이터 입력이 완료되었습니다.',
    })

    process.exit(0)
  } catch (error) {
    console.error('시드 데이터 입력 중 오류:', error)
    throw new Error('데이터 입력이 실패하였습니다.')
  }
}

main()
