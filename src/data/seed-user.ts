import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'
import { userData } from './data-user'
import { connectToDatabase } from '@/lib/db'
import User from '@/lib/db/models/user.model'

loadEnvConfig(cwd())

const main = async () => {
  try {
    await connectToDatabase(process.env.MONGODB_URI)

    const createdUser = await User.insertMany(userData)

    console.log({
      createdUser,
      message: '데이터 입력이 완료되었습니다.',
    })
    process.exit(0)
  } catch (error) {
    console.error(error)
    throw new Error('데이터 입력이 실패하였습니다.')
  }
}

main()
