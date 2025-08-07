import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'
import { contactData } from './data-contact'
import { connectToDatabase } from '@/lib/db'
import Contact from '@/lib/db/models/contact.model'

loadEnvConfig(cwd())

const main = async () => {
  try {
    await connectToDatabase(process.env.MONGODB_URI)

    await Contact.deleteMany()
    const createdContact = await Contact.insertMany(contactData)

    console.log({
      createdContact,
      message: '데이터 입력이 완료되었습니다.',
    })
    process.exit(0)
  } catch (error) {
    console.error(error)
    throw new Error('데이터 입력이 실패하였습니다.')
  }
}

main()
