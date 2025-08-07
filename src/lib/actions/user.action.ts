'use server'

import bcrypt from 'bcryptjs'
import User from '../db/models/user.model'
import { revalidatePath } from 'next/cache'
import { connectToDatabase } from '../db'
import { signIn, signOut } from '@/auth'
import { generateVerificationCode } from '../utils'
import { sendVerificationEmail } from '@/email/send-email-verification'
import { sendAdminNotification } from '@/email/send-admin-notification'
import { sendVerificationPassword } from '@/email/send-password-verification'
import {
  IEmailOnlyInput,
  IPasswordResetInput,
  IUserSignInInput,
  IUserSignUpInput,
  IVerifyEmailInput,
  UserEditInput,
} from '../type'
import {
  EmailOnlySchema,
  PasswordResetSchema,
  UserSignUpSchema,
  VerifyEmailSchema,
  UserEditSchema,
} from '../validator'

// 1. initiateSignup : 회원가입 1단계 : 이메일 인증 코드 발송
// 2. verifySignup : 회원가입 2단계 : 인증 코드 확인
// 3. completeSignup : 회원가입 3단계 : 회원가입 완료
// 4. updateUser : 사용자 정보 수정
// 5. signInWithCredentials : 로그인
// 6. SignOut : 로그아웃
// 7. checkEmailExists 이메일 찾기
// 8. 비밀번호 찾기 1단계 : 이메일 확인 및 발송
// 9. 비밀번호 찾기 2단계 : 인증번호 확인
// 10. 비밀번호 찾기 3단계 : 비밀번호 재설정

// 회원가입 1단계: 이메일 인증 코드 발송
export async function initiateSignup(data: IEmailOnlyInput) {
  try {
    // DB 접속
    await connectToDatabase()

    // zod 유효성 검사
    const { email } = await EmailOnlySchema.parseAsync(data)

    // 이메일 중복 확인
    const existing = await User.findOne({
      email: email.toLowerCase(),
      emailVerified: true,
    })

    // 이미 등록된 이메일이 있다면
    if (existing) {
      return { success: false, message: '이미 등록된 이메일입니다.' }
    }

    // 기존 미인증 사용자 삭제 (있다면)
    await User.deleteMany({
      email: email.toLowerCase(),
      emailVerified: false,
    })

    // 인증 토큰 생성
    const verificationCode = generateVerificationCode()
    const expires = new Date(Date.now() + 5 * 60 * 1000)

    // 임시 회원가입 (이메일 미인증 상태)
    const tempUser = await User.create({
      email: email.trim().toLowerCase(),
      verificationCode: verificationCode,
      verificationCodeExpires: expires,
      emailVerified: false,
    })

    // 인증 이메일 발송
    try {
      await sendVerificationEmail(email, verificationCode)
      return {
        success: true,
        message: `${email}로 인증번호가 발송되었습니다. 5분 내에 인증을 완료해주세요.`,
        email,
      }
    } catch (emailError) {
      // 이메일 발송 실패 시 임시 사용자 삭제
      await User.findByIdAndDelete(tempUser._id)
      console.error('이메일 발송 실패:', emailError)
      return {
        success: false,
        message: '인증 이메일 발송에 실패했습니다.',
      }
    }
  } catch (error) {
    console.error('회원가입 오류:', error)
    return {
      success: false,
      message: '회원가입 중 알 수 없는 오류가 발생했습니다.',
    }
  }
}

// 회원가입 2단계: 인증 코드 확인
export async function verifySignup(data: IVerifyEmailInput) {
  try {
    // zod 비동기 유효성 검사
    const { email, verificationCode } = await VerifyEmailSchema.parseAsync(data)

    // DB 접속
    await connectToDatabase()

    // 사용자 찾기
    const user = await User.findOne({
      email: email.toLowerCase(),
      verificationCode: verificationCode,
      verificationCodeExpires: { $gt: new Date() },
      emailVerified: false,
    })

    // 사용자가 없다면
    if (!user) {
      const userByEmail = await User.findOne({ email: email.toLowerCase() })
      console.log('이메일로 찾은 사용자:', userByEmail)

      return {
        success: false,
        message: '인증번호가 유효하지 않거나 만료되었습니다.',
      }
    }

    // 사용자 인증 완료 (하지만 아직 회원가입은 미완료)
    user.emailVerified = true
    user.verificationCode = ''
    user.verificationCodeExpires = null
    await user.save()

    return {
      success: true,
      message: '이메일 인증이 완료되었습니다. 회원가입을 완료해주세요.',
      email: user.email,
    }
  } catch (error) {
    console.error('이메일 인증 오류:', error)
    return {
      success: false,
      message: '인증 중 알 수 없는 오류가 발생했습니다.',
    }
  }
}

// 회원가입 3단계: 회원가입 완료
export async function completeSignup(data: IUserSignUpInput) {
  try {
    // zod 비동기 유효성 검사
    const { email, name, password } = await UserSignUpSchema.parseAsync(data)

    // DB 접속
    await connectToDatabase()

    // 이메일 인증된 사용자 찾기
    const user = await User.findOne({
      email: email.toLowerCase(),
      emailVerified: true,
    })
    if (!user) {
      return { success: false, message: '이메일 인증이 완료되지 않았습니다.' }
    }

    // 이미 회원가입이 완료된 사용자인지 확인
    if (user.name && user.password) {
      return {
        success: false,
        message: '이미 회원가입이 완료된 사용자입니다.',
      }
    }

    // 이름 중복 확인
    const nameExists = await User.findOne({
      name,
      _id: { $ne: user._id },
    })
    if (nameExists) {
      return { success: false, message: '이미 사용 중인 이름입니다.' }
    }

    // 회원가입 완료
    const registrationDate = new Date()
    user.name = name
    user.username = name
    user.password = await bcrypt.hash(password, 10)
    user.role = 'user'
    user.image = '/face/default.jpg'
    user.visitCount = 0
    user.createdAt = registrationDate
    await user.save()

    // 관리자에게 알림 이메일 발송
    try {
      await sendAdminNotification({
        name: user.name,
        email: user.email,
        registrationDate: registrationDate,
      })
      console.log('관리자 알림 이메일 발송 성공')
    } catch (emailError) {
      console.error('관리자 알림 이메일 발송 실패:', emailError)
    }

    return {
      success: true,
      message: `${user.name}님, 회원가입이 완료되었습니다!`,
    }
  } catch (error) {
    console.error('회원가입 완료 오류:', error)
    return {
      success: false,
      message: '회원가입 완료 중 알 수 없는 오류가 발생했습니다.',
    }
  }
}

// 로그인
export async function signInWithCredentials(user: IUserSignInInput) {
  try {
    const res = await signIn('credentials', {
      redirect: false,
      email: user.email,
      password: user.password,
    })

    if (!res || res.error) {
      return {
        success: false,
        error: res?.error || '로그인에 실패함!',
      }
    }

    // 로그인 성공 후 사용자 정보 가져오기
    await connectToDatabase()
    const userInfo = await User.findOne({ email: user.email.toLowerCase() })

    if (!userInfo) {
      return {
        success: false,
        error: '사용자 정보를 찾을 수 없습니다.',
      }
    }

    return {
      success: true,
      user: {
        id: userInfo._id.toString(),
        name: userInfo.name,
        username: userInfo.username,
        email: userInfo.email,
        role: userInfo.role,
        visitCount: userInfo.visitCount || 0,
        image: userInfo.image,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: JSON.stringify(error),
    }
  }
}

// 로그아웃
export const SignOut = async () => {
  try {
    await signOut({ redirect: false })
    return { success: true }
  } catch (error) {
    console.error('로그아웃 오류:', error)
    return { success: false, error: '로그아웃 중 오류가 발생했습니다.' }
  }
}

// 이메일 찾기
export async function checkEmailExists(email: string) {
  try {
    // MongoDB 연결
    await connectToDatabase()

    // 이메일 찾기
    const user = await User.findOne({ email }).lean()

    if (user) {
      return { success: true }
    } else {
      return { success: false }
    }
  } catch (error) {
    console.error('이메일 조회 오류:', error)
    return { success: false, error: '이메일 조회 중 오류가 발생했습니다.' }
  }
}

// 비밀번호 찾기 1단계 : 이메일 확인 및 발송
export async function initiatePassword(data: IEmailOnlyInput) {
  try {
    const { email } = await EmailOnlySchema.parseAsync(data)

    await connectToDatabase()

    // 사용자 존재 확인
    const user = await User.findOne({
      email: email.toLowerCase(),
      emailVerified: true,
    })

    if (!user) {
      return { success: false, message: '등록되지 않은 이메일입니다.' }
    }

    // 인증 코드 생성
    const verificationCode = generateVerificationCode()
    const expires = new Date(Date.now() + 5 * 60 * 1000) // 5분 후 만료

    // 사용자에게 인증 코드 저장
    user.verificationCode = verificationCode
    user.verificationCodeExpires = expires
    await user.save()

    // 인증 이메일 발송
    try {
      await sendVerificationPassword(email, verificationCode)
      return {
        success: true,
        message: `${email}로 인증번호가 발송되었습니다. 5분 내에 인증을 완료해주세요.`,
      }
    } catch (emailError) {
      console.error('이메일 발송 실패:', emailError)
      return {
        success: false,
        message: '인증 이메일 발송에 실패했습니다.',
      }
    }
  } catch (error) {
    console.error('비밀번호 재설정 오류:', error)
    return {
      success: false,
      message: '비밀번호 재설정 중 오류가 발생했습니다.',
    }
  }
}

// 비밀번호 찾기 2단계 : 인증번호 확인
export async function verifyPassword(data: IVerifyEmailInput) {
  try {
    const { email, verificationCode } = await VerifyEmailSchema.parseAsync(data)

    await connectToDatabase()

    const user = await User.findOne({
      email: email.toLowerCase(),
      verificationCode: verificationCode,
      verificationCodeExpires: { $gt: new Date() },
    })

    if (!user) {
      return {
        success: false,
        message: '인증번호가 유효하지 않거나 만료되었습니다.',
      }
    }

    return {
      success: true,
      message: '인증번호가 확인되었습니다.',
    }
  } catch (error) {
    console.error('인증번호 확인 오류:', error)
    return {
      success: false,
      message: '인증 중 오류가 발생했습니다.',
    }
  }
}

// 비밀번호 찾기 3단계 : 비밀번호 재설정
export async function resetPassword(data: IPasswordResetInput) {
  try {
    const { email, verificationCode, newPassword } =
      await PasswordResetSchema.parseAsync(data)

    await connectToDatabase()

    const user = await User.findOne({
      email: email.toLowerCase(),
      verificationCode: verificationCode,
      verificationCodeExpires: { $gt: new Date() },
    })

    if (!user) {
      return {
        success: false,
        message: '인증번호가 유효하지 않거나 만료되었습니다.',
      }
    }

    // 새 비밀번호 해시화 및 저장
    user.password = await bcrypt.hash(newPassword, 10)
    user.verificationCode = ''
    user.verificationCodeExpires = null
    await user.save()

    return {
      success: true,
      message: '비밀번호가 성공적으로 변경되었습니다.',
    }
  } catch (error) {
    console.error('비밀번호 재설정 오류:', error)
    return {
      success: false,
      message: '비밀번호 변경 중 오류가 발생했습니다.',
    }
  }
}

// 구글 로그인
export const SignInWithGoogle = async () => {
  await signIn('google')
}

// 깃헙 로그인
export const SignInWithGithub = async () => {
  await signIn('github')
}

// 1. getAllUsers : 모든 회원 가져오기
// 2. getAllUsersPage : 모든 회원 가져오기(페이지, 검색)
// 3. deleteUser : 회원 삭제
// 4. updateUser : 회원 수정

// 모든 회원 가져오기
export async function getAllUsers() {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 모든 사용자 조회
    const users = await User.find().sort({ createdAt: -1 }).lean()

    // JSON 직렬화
    const serialized = JSON.parse(JSON.stringify(users))

    return {
      success: true,
      users: serialized,
    }
  } catch (error) {
    console.error('사용자 목록 조회 중 오류 발생:', error)

    return {
      success: false,
      error: '사용자 목록을 불러오는 중 오류가 발생했습니다.',
    }
  }
}

// 모든 회원 가져오기(페이지, 검색)
export async function getAllUsersPage(
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
            { name: { $regex: searchQuery, $options: 'i' } },
            { email: { $regex: searchQuery, $options: 'i' } },
            { role: { $regex: searchQuery, $options: 'i' } },
            { provider: { $regex: searchQuery, $options: 'i' } },
          ],
        }
      : {}

    // 총 개수 조회
    const totalCount = await User.countDocuments(searchCondition)

    // 페이지네이션된 데이터 조회
    const users = await User.find(searchCondition)
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
      users: JSON.parse(JSON.stringify(users)),
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
    console.error('사용자 조회 오류:', error)
    return {
      success: false,
      error: '사용자 데이터를 불러오는데 실패했습니다.',
    }
  }
}

// 회원 삭제
export async function deleteUser(userId: string) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 사용자 ID 유효성 검사
    if (!userId) {
      return {
        success: false,
        error: '삭제할 사용자 ID가 필요합니다.',
      }
    }

    // 사용자 존재 확인
    const existingUser = await User.findById(userId)
    if (!existingUser) {
      return {
        success: false,
        error: '삭제하려는 사용자를 찾을 수 없습니다.',
      }
    }

    // 사용자 삭제
    await User.findByIdAndDelete(userId)

    // 캐시 갱신
    revalidatePath('/')

    return {
      success: true,
      message: '사용자가 성공적으로 삭제되었습니다.!',
    }
  } catch (error) {
    console.error('사용자 삭제 중 오류 발생:', error)

    return {
      success: false,
      error: '사용자 삭제 중 오류가 발생했습니다.',
    }
  }
}

// 사용자 정보 수정
export async function updateUser(userId: string, data: UserEditInput) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 사용자 ID 유효성 검사
    if (!userId) {
      return {
        success: false,
        error: '수정할 사용자 ID가 필요합니다.',
      }
    }

    // zod 유효성 검사
    const validatedData = await UserEditSchema.parseAsync(data)

    // 사용자 존재 확인
    const existingUser = await User.findById(userId)
    if (!existingUser) {
      return {
        success: false,
        error: '수정하려는 사용자를 찾을 수 없습니다.',
      }
    }

    // 이메일 중복 확인
    if (validatedData.email !== existingUser.email) {
      const emailExists = await User.findOne({
        email: validatedData.email.toLowerCase(),
        _id: { $ne: userId }, // 현재 사용자 제외
      })

      if (emailExists) {
        return {
          success: false,
          error: '이미 사용 중인 이메일입니다.',
        }
      }
    }

    // 사용자 정보 업데이트
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: validatedData.name,
        username: validatedData.username,
        email: validatedData.email.toLowerCase(),
        role: validatedData.role,
        provider: validatedData.provider,
        image: validatedData.image,
        isActive: validatedData.isActive,
        emailVerified: validatedData.emailVerified,
      },
      { new: true, runValidators: true }
    )

    if (!updatedUser) {
      return {
        success: false,
        error: '사용자 정보 수정에 실패했습니다.',
      }
    }

    // 캐시 갱신
    revalidatePath('/')

    return {
      success: true,
      message: '사용자 정보가 성공적으로 수정되었습니다.',
      user: JSON.parse(JSON.stringify(updatedUser)),
    }
  } catch (error) {
    console.error('사용자 수정 중 오류 발생:', error)

    // zod 검증 오류 처리
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        error: '입력 데이터가 올바르지 않습니다.',
      }
    }

    return {
      success: false,
      error: '사용자 정보 수정 중 오류가 발생했습니다.',
    }
  }
}
