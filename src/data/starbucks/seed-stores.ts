import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'
import { connectToDatabase } from '@/lib/db'

import Store from '@/lib/db/models/store.model'
import { jejuStoresData } from './data-jeju-stores'

loadEnvConfig(cwd())

const main = async () => {
  try {
    await connectToDatabase(process.env.MONGODB_URI)

    // 기존 데이터 전체 삭제 (한 번만)
    await Store.deleteMany()

    // 모든 데이터 합치기
    const allStores = [...jejuStoresData]

    // 한 번에 insert
    const createdStores = await Store.insertMany(allStores)

    console.log({
      createdStores,
      message: '데이터 입력이 완료되었습니다.',
    })
    process.exit(0)
  } catch (error) {
    console.error(error)
    throw new Error('데이터 입력이 실패하였습니다.')
  }
}

main()
