'use server'

import { revalidatePath } from 'next/cache'
import Contact from '@/lib/db/model/contact.model'
import { connectToDatabase } from '../db'
import type { IContactInput } from '../type'
import { ContactSchema } from '../validator'
import { sendContactNotification } from '@/email/contact-notification'

// 문의사항 만들기 : createContact
// 모든 문의사항 가져오기 (관리자용) : getAllContacts
// 문의사항 목록 가져오기 (페이지네이션) : getContacts
// 문의사항 상태 변경 : updateContactStatus
// 문의사항 삭제 : deleteContact

// 문의사항 만들기
export async function createContact(formData: IContactInput) {
  try {
    // MongoDB 연결
    await connectToDatabase()

    // Zod 스키마로 입력 검증
    const parsedData = await ContactSchema.parseAsync(formData)

    // 문의 내용 저장
    const newContact = await Contact.create(parsedData)

    // 관리자에게 알림 이메일 발송
    try {
      await sendContactNotification({
        email: parsedData.email,
        title: parsedData.title,
        message: parsedData.message,
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

// 모든 문의사항 가져오기 (관리자용)
export async function getAllContacts() {
  try {
    await connectToDatabase()

    const contacts = await Contact.find({}).sort({ createdAt: -1 }).lean()
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

// 문의사항 목록 가져오기 (페이지네이션)
export async function getContacts(page = 1, limit = 10) {
  try {
    await connectToDatabase()

    const skip = (page - 1) * limit

    // 문의사항 목록 조회 (최신순)
    const contacts = await Contact.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()

    // 전체 문의사항 수 조회
    const totalContacts = await Contact.countDocuments({})

    return {
      success: true,
      data: {
        contacts: JSON.parse(JSON.stringify(contacts)),
        totalContacts,
        totalPages: Math.ceil(totalContacts / limit),
        currentPage: page,
      },
    }
  } catch (err) {
    console.error('문의사항 조회 중 오류 발생:', err)
    return {
      success: false,
      message: '문의사항을 불러오는 중 오류가 발생했습니다.',
    }
  }
}

// 문의사항 상태 변경
export async function updateContactStatus(
  contactId: string,
  status: '대기중' | '확인완료' | '답장완료'
) {
  try {
    await connectToDatabase()

    if (!contactId) {
      return {
        success: false,
        error: '문의사항 ID가 필요합니다.',
      }
    }

    const existingContact = await Contact.findById(contactId)
    if (!existingContact) {
      return {
        success: false,
        error: '문의사항을 찾을 수 없습니다.',
      }
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      {
        status: status,
        updatedAt: new Date(),
      },
      { new: true }
    )

    // 캐시 갱신
    revalidatePath('/admin')

    return {
      success: true,
      message: `문의사항 상태가 "${status}"로 변경되었습니다.`,
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

// 문의사항 삭제
export async function deleteContact(contactId: string) {
  try {
    await connectToDatabase()

    if (!contactId) {
      return {
        success: false,
        error: '삭제할 문의사항 ID가 필요합니다.',
      }
    }

    const existingContact = await Contact.findById(contactId)
    if (!existingContact) {
      return {
        success: false,
        error: '삭제하려는 문의사항을 찾을 수 없습니다.',
      }
    }

    await Contact.findByIdAndDelete(contactId)

    // 캐시 갱신
    revalidatePath('/admin')

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
