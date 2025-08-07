import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'
import { connectToDatabase } from '@/lib/db'

import Post from '@/lib/db/models/post.model'
// import { busanPostsData } from './data-busan-posts'
// import { chungbukPostsData } from './data-chungbuk-posts'
// import { chungnamPostsData } from './data-chungnam-posts'
// import { daejeonPostsData } from './data-daejeon-posts'
// import { gwangjuPostsData } from './data-gwangju-posts'
// import { incheonPostsData } from './data-incheon-posts'
// import { jeolbukPostsData } from './data-jeolbuk-posts'
// import { jeolnamPostsData } from './data-jeolnam-posts'
// import { daeguPostsData } from './data-daegu-posts'
import { jejuPostsData } from './data-jeju-posts'

loadEnvConfig(cwd())

const main = async () => {
  try {
    await connectToDatabase(process.env.MONGODB_URI)

    // 기존 데이터 전체 삭제 (한 번만)
    await Post.deleteMany()

    // 모든 데이터 합치기
    const allPosts = [
      ...jejuPostsData,
      // ...busanPostsData,
      // ...chungbukPostsData,
      // ...chungnamPostsData,
      // ...daeguPostsData,
      // ...daejeonPostsData,
      // ...gwangjuPostsData,
      // ...incheonPostsData,
      // ...jeolbukPostsData,
      // ...jeolnamPostsData,
    ]

    // 한 번에 insert
    const createdPosts = await Post.insertMany(allPosts)

    console.log({
      createdPosts,
      message: '데이터 입력이 완료되었습니다.',
    })
    process.exit(0)
  } catch (error) {
    console.error(error)
    throw new Error('데이터 입력이 실패하였습니다.')
  }
}

main()
