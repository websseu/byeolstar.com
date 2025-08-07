'use server'

import Contact from '../db/models/contact.model'
import { sendContactNotification } from '@/email/send-contact-notification'
import { connectToDatabase } from '../db'
import { IContactInput } from '../type'
import { ContactInputSchema } from '../validator'
import { revalidatePath } from 'next/cache'

// 1. createContact : 문의사항 만들기
// 2. getAllContacts : 문의사항 가져오기
// 3. getAllContactsPage : 문의사항 가져오기(페이지, 검색)
// 4. deleteContact : 문의사항 삭제
// 4. updateContactStatus : 문의사항 상태 업데이트

// 문의사항 만들기
export async function createContact(data: IContactInput) {
  try {
    // MongoDB 연결
    await connectToDatabase()

    // 입력 데이터 유효성 검사
    const validatedData = ContactInputSchema.parse(data)

    // 문의 내용 저장
    const newContact = await Contact.create(validatedData)

    // 관리자에게 알림 이메일 발송
    try {
      await sendContactNotification({
        email: validatedData.email,
        message: validatedData.message,
        contactDate: newContact.createdAt,
      })
      console.log('관리자 문의 알림 이메일 발송 성공')
    } catch (emailError) {
      console.error('관리자 문의 알림 이메일 발송 실패:', emailError)
    }

    // 캐시 갱신
    revalidatePath('/admin')

    // 성공 응답 반환
    return {
      success: true,
      message: '문의가 성공적으로 접수되었습니다.',
    }
  } catch (err) {
    console.error('문의 저장 중 오류 발생:', err)
    // 실패 응답 반환
    return {
      success: false,
      message: '문의 저장 중 오류가 발생했습니다.',
    }
  }
}

// 문의사항 가져오기
export async function getAllContacts() {
  try {
    // MongoDB 연결
    await connectToDatabase()

    // 모든 문의사항 조회
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean()

    // JSON 직렬화
    const serialized = JSON.parse(JSON.stringify(contacts))

    return {
      success: true,
      contacts: serialized,
    }
  } catch (error) {
    console.error('문의사항 목록 조회 중 오류 발생:', error)

    return {
      success: false,
      error: '문의사항 목록을 불러오는 중 오류가 발생했습니다.',
    }
  }
}

// 문의사항 가져오기(페이지, 검색)
export async function getAllContactsPage(
  page = 1,
  limit = 10,
  searchQuery?: string
) {
  try {
    // MongoDB 연결
    await connectToDatabase()

    // 페이지네이션 계산
    const skip = (page - 1) * limit

    // 검색 조건 설정
    const searchCondition = searchQuery
      ? {
          $or: [
            { email: { $regex: searchQuery, $options: 'i' } },
            { message: { $regex: searchQuery, $options: 'i' } },
          ],
        }
      : {}

    // 총 개수 조회
    const totalCount = await Contact.countDocuments(searchCondition)

    // 페이지네이션된 데이터 조회
    const contacts = await Contact.find(searchCondition)
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
      contacts: JSON.parse(JSON.stringify(contacts)),
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
    console.error('문의사항 조회 오류:', error)
    return {
      success: false,
      error: '문의사항 데이터를 불러오는데 실패했습니다.',
    }
  }
}

// 문의사항 삭제
export async function deleteContact(contactId: string) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 문의사항 ID 유효성 검사
    if (!contactId) {
      return {
        success: false,
        error: '삭제할 문의사항 ID가 필요합니다.',
      }
    }

    // 문의사항 존재 확인
    const existingContact = await Contact.findById(contactId)
    if (!existingContact) {
      return {
        success: false,
        error: '삭제하려는 문의사항을 찾을 수 없습니다.',
      }
    }

    // 문의사항 삭제
    await Contact.findByIdAndDelete(contactId)

    // 캐시 갱신
    revalidatePath('/')

    return {
      success: true,
      message: '문의사항이 성공적으로 삭제되었습니다.',
    }
  } catch (error) {
    console.error('문의사항 삭제 중 오류 발생:', error)

    return {
      success: false,
      error: '문의사항 삭제 중 오류가 발생했습니다.',
    }
  }
}

// 문의사항 상태 업데이트
export async function updateContactStatus(
  contactId: string,
  status: '대기중' | '확인완료' | '답장완료'
) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 문의사항 ID 유효성 검사
    if (!contactId) {
      return {
        success: false,
        error: '문의사항 ID가 필요합니다.',
      }
    }

    // 문의사항 존재 확인
    const existingContact = await Contact.findById(contactId)
    if (!existingContact) {
      return {
        success: false,
        error: '문의사항을 찾을 수 없습니다.',
      }
    }

    // 상태 업데이트
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      {
        status,
        updatedAt: new Date(),
      },
      { new: true }
    )

    // 캐시 갱신
    revalidatePath('/admin')

    return {
      success: true,
      message: `문의사항 상태가 '${status}'로 변경되었습니다.`,
      status: updatedContact?.status,
    }
  } catch (error) {
    console.error('문의사항 상태 변경 중 오류 발생:', error)

    return {
      success: false,
      error: '문의사항 상태 변경 중 오류가 발생했습니다.',
    }
  }
}
