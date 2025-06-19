import { z } from 'zod'
import {
  ContactSchema,
  EmailOnlySchema,
  PasswordResetSchema,
  PostInputSchema,
  PostUpdateSchema,
  StoreInputSchema,
  StoreUpdateSchema,
  TermsAgreementSchema,
  UserSignInSchema,
  UserSignUpSchema,
  VerifyEmailSchema,
} from './validator'

// 문의사항
export type IContactInput = z.infer<typeof ContactSchema>

// 회원가입
export type ITermsAgreementInput = z.infer<typeof TermsAgreementSchema>
export type IEmailOnlyInput = z.infer<typeof EmailOnlySchema>
export type IVerifyEmailInput = z.infer<typeof VerifyEmailSchema>
export type IUserSignUpInput = z.infer<typeof UserSignUpSchema>

// 로그인
export type IUserSignInInput = z.infer<typeof UserSignInSchema>

// 비밀번호 리셋
export type IPasswordResetInput = z.infer<typeof PasswordResetSchema>

// 글 쓰기
export type IPostInput = z.infer<typeof PostInputSchema>
export type IPostUpdateInput = z.infer<typeof PostUpdateSchema>

// 스토어
export type IStoreInput = z.infer<typeof StoreInputSchema>
export type IStoreUpdateInput = z.infer<typeof StoreUpdateSchema>
