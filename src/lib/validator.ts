import { z } from 'zod'

// 문의사항
export const ContactSchema = z.object({
  email: z.string().email({ message: '→ 유효한 이메일을 입력해주세요.' }),
  title: z
    .string()
    .min(5, { message: '→ 제목은 5글자 이상 입력해주세요.' })
    .max(50, { message: '→ 제목은 최대 50자까지 입력할 수 있습니다.' }),
  message: z
    .string()
    .min(10, { message: '→ 메시지는 최소 10자 이상 입력해주세요.' })
    .max(300, { message: '→ 메시지는 최대 300자까지 입력할 수 있습니다.' }),
  status: z.enum(['대기중', '확인완료', '답장완료']).optional(),
})

// 회원가입 1단계: 약관 동의
export const TermsAgreementSchema = z.object({
  termsOfService: z.boolean().refine((val) => val === true, {
    message: '→ 이용약관에 동의해주세요.',
  }),
  privacyPolicy: z.boolean().refine((val) => val === true, {
    message: '→ 개인정보취급방침에 동의해주세요.',
  }),
  allAgreed: z.boolean().optional(),
})

// 회원가입 2단계: 이메일 입력
export const EmailOnlySchema = z.object({
  email: z.string().email('→ 유효한 이메일 주소를 입력해주세요.'),
})

// 회원가입 3단계: 이메일 인증
export const VerifyEmailSchema = z.object({
  email: z.string().email('→ 유효한 이메일 주소를 입력해주세요.'),
  verificationCode: z.string().length(6, '→ 인증번호는 6자리여야 합니다.'),
})

// 회원가입 4단계: 사용자 정보 입력
export const UserSignUpSchema = z
  .object({
    email: z.string().email('→ 유효한 이메일 주소를 입력해주세요.'),
    name: z
      .string()
      .min(2, '→ 이름은 최소 2자 이상이어야 합니다.')
      .max(20, '→ 이름은 최대 20자까지 입력할 수 있습니다.'),
    password: z
      .string()
      .min(6, '→ 비밀번호는 최소 6자 이상이어야 합니다.')
      .regex(/[A-Z]/, '→ 비밀번호에는 최소 하나의 대문자가 포함되어야 합니다.')
      .regex(/[0-9]/, '→ 비밀번호에는 최소 하나의 숫자가 포함되어야 합니다.'),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => !data.confirmPassword || data.password === data.confirmPassword, {
    message: '→ 비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  })

// 로그인
export const UserSignInSchema = z.object({
  email: z.string().email('→ 유효한 이메일 주소를 입력해주세요.'),
  password: z
    .string()
    .min(6, '→ 비밀번호는 최소 6자 이상이어야 합니다.')
    .regex(/[A-Z]/, '→ 비밀번호에는 최소 하나의 대문자가 포함되어야 합니다.')
    .regex(/[0-9]/, '→ 비밀번호에는 최소 하나의 숫자가 포함되어야 합니다.'),
})

// 비밀번호 리셋
export const PasswordResetSchema = z
  .object({
    email: z.string().email('올바른 이메일 형식이 아닙니다.'),
    verificationCode: z
      .string()
      .min(6, '인증번호는 6자리입니다.')
      .max(6, '인증번호는 6자리입니다.'),
    newPassword: z
      .string()
      .min(8, '비밀번호는 최소 8자리 이상이어야 합니다.')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        '비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다.'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  })

// 글 쓰기
export const PostInputSchema = z.object({
  title: z
    .string()
    .min(1, { message: '제목을 입력해주세요.' })
    .max(200, { message: '제목은 최대 200자까지 가능합니다.' }),
  slug: z
    .string()
    .min(1, { message: '슬러그를 입력해주세요.' })
    .max(200, { message: '슬러그는 최대 200자까지 가능합니다.' }),
  category: z.string().min(1, { message: '카테고리를 선택해주세요.' }),
  components: z.string().optional(),
  description: z.string().max(500, { message: '→ 설명은 최대 500자까지 가능합니다.' }).optional(),
  contents: z.string().optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean(),
  author: z.string().optional(),
  storeId: z.string().optional(),
})

// 글 업데이트용
export const PostUpdateSchema = PostInputSchema.partial().extend({
  id: z.string().min(1, { message: '→ 게시글 ID가 필요합니다.' }),
})

// 매장 정보
export const StoreInputSchema = z.object({
  storeId: z.string().min(1, 'storeId는 필수입니다.'),
  name: z.string().min(1, '매장 이름을 입력해주세요.'),
  address: z.string().min(1, '주소를 입력해주세요.'),
  location: z.string().min(1, '지역명을 입력해주세요.'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  parking: z.string().min(1, '주차 정보를 입력해주세요.'),
  since: z.string().min(1, '개점일을 입력해주세요.'),
  phone: z.string().optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
})

// 매장 업데이트용
export const StoreUpdateSchema = StoreInputSchema.partial().extend({
  id: z.string().min(1, { message: '→ 매장 ID가 필요합니다.' }),
})

// 댓글 작성
export const CommentInputSchema = z.object({
  postId: z.string().min(1, { message: '→ 게시글 ID가 필요합니다.' }),
  author: z
    .string()
    .min(1, { message: '→ 닉네임을 입력해주세요.' })
    .max(20, { message: '→ 닉네임은 최대 20자까지 입력할 수 있습니다.' })
    .regex(/^[가-힣a-zA-Z0-9_-]+$/, {
      message: '→ 닉네임은 한글, 영문, 숫자, _, -만 사용 가능합니다.',
    }),
  content: z
    .string()
    .min(1, { message: '→ 댓글 내용을 입력해주세요.' })
    .max(500, { message: '→ 댓글은 최대 500자까지 입력할 수 있습니다.' })
    .refine((val) => val.trim().length > 0, {
      message: '→ 공백만으로는 댓글을 작성할 수 없습니다.',
    }),
  email: z.string().email({ message: '→ 유효한 이메일을 입력해주세요.' }).optional(), // 선택적 이메일 (알림용)
})

// 댓글 업데이트
export const CommentUpdateSchema = z.object({
  id: z.string().min(1, { message: '→ 댓글 ID가 필요합니다.' }),
  content: z
    .string()
    .min(1, { message: '→ 댓글 내용을 입력해주세요.' })
    .max(500, { message: '→ 댓글은 최대 500자까지 입력할 수 있습니다.' })
    .refine((val) => val.trim().length > 0, {
      message: '→ 공백만으로는 댓글을 작성할 수 없습니다.',
    }),
})
