import { z } from 'zod'
import {
  ContactInputSchema,
  EmailExistenceSchema,
  EmailOnlySchema,
  PasswordResetSchema,
  PostInputSchema,
  PostUpdateSchema,
  StoreInputSchema,
  StoreUpdateSchema,
  TermsAgreementSchema,
  UserEditSchema,
  UserSignInSchema,
  UserSignUpSchema,
  VerifyEmailSchema,
} from './validator'

// 문의사항
export type IContactInput = z.infer<typeof ContactInputSchema>

// 회원가입
export type ITermsAgreementInput = z.infer<typeof TermsAgreementSchema>
export type IEmailOnlyInput = z.infer<typeof EmailOnlySchema>
export type IVerifyEmailInput = z.infer<typeof VerifyEmailSchema>
export type IUserSignUpInput = z.infer<typeof UserSignUpSchema>

// 로그인
export type IUserSignInInput = z.infer<typeof UserSignInSchema>

// 이메일 존재 여부 확인
export type IEmailExistenceInput = z.infer<typeof EmailExistenceSchema>

// 비밀번호 리셋
export type IPasswordResetInput = z.infer<typeof PasswordResetSchema>

// 회원정보 수정
export type UserEditInput = z.infer<typeof UserEditSchema>

// 글 쓰기
export type IPostInput = z.infer<typeof PostInputSchema>

// 글 수정하기
export type IPostUpdateInput = z.infer<typeof PostUpdateSchema>

// 스토어 생성
export type IStoreInput = z.infer<typeof StoreInputSchema>

// 스토어 수정하기
export type IStoreUpdateInput = z.infer<typeof StoreUpdateSchema>

// 페이지네이션
export interface Pagination {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}
