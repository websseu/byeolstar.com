'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Mail, Send, Handshake, UserPlus, CheckCircle, FileText, Shield } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  IEmailOnlyInput,
  ITermsAgreementInput,
  IUserSignUpInput,
  IVerifyEmailInput,
} from '@/lib/type'
import {
  EmailOnlySchema,
  TermsAgreementSchema,
  UserSignUpSchema,
  VerifyEmailSchema,
} from '@/lib/validator'
import SheetPrivacy from '../sheet/sheet-privacy'
import SheetCondition from '../sheet/sheet-condition'
import { completeSignup, initiateSignup, verifySignup } from '@/lib/actions/user.action'

type SignupStep = 'terms' | 'email' | 'verification' | 'userInfo' | 'success'

interface DialogSignupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DialogSignup({ open, onOpenChange }: DialogSignupProps) {
  const [currentStep, setCurrentStep] = useState<SignupStep>('terms')
  const [userEmail, setUserEmail] = useState('')

  // 1단계: 약관 동의 폼
  const termsForm = useForm<ITermsAgreementInput>({
    resolver: zodResolver(TermsAgreementSchema),
    defaultValues: {
      termsOfService: false,
      privacyPolicy: false,
      allAgreed: false,
    },
  })

  // 2단계: 이메일 입력 폼
  const emailForm = useForm<IEmailOnlyInput>({
    resolver: zodResolver(EmailOnlySchema),
    defaultValues: {
      email: '',
    },
  })

  // 3단계: 인증번호 확인 폼
  const verificationForm = useForm<IVerifyEmailInput>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      email: '',
      verificationCode: '',
    },
  })

  // 4단계: 사용자 정보 입력 폼
  const userInfoForm = useForm<IUserSignUpInput>({
    resolver: zodResolver(UserSignUpSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    },
  })

  // 1단계: 약관 동의
  const onSubmitTerms = async (data: ITermsAgreementInput) => {
    if (data.termsOfService && data.privacyPolicy) {
      setCurrentStep('email')
    }
  }

  // 2단계: 이메일 제출 및 인증 메일 발송
  const onSubmitEmail = async (data: IEmailOnlyInput) => {
    try {
      const res = await initiateSignup(data)

      if (res.success) {
        toast.success(res.message)
        setCurrentStep('verification')
        setUserEmail(data.email)
        verificationForm.setValue('email', data.email)
      } else {
        toast.error(res.message)
      }
    } catch (err) {
      toast.error('이메일 발송 중 오류가 발생했습니다.')
      console.error('이메일 발송 오류:', err)
    }
  }

  // 3단계: 인증번호 확인
  const onVerifyEmail = async (data: IVerifyEmailInput) => {
    try {
      const res = await verifySignup(data)

      if (res.success) {
        toast.success(res.message)
        setCurrentStep('userInfo')
        userInfoForm.setValue('email', userEmail)
      } else {
        toast.error(res.message)
      }
    } catch (err) {
      toast.error('인증 중 오류가 발생했습니다.')
      console.error('인증 오류:', err)
    }
  }

  // 4단계: 사용자 정보 입력 및 회원가입 완료
  const onSubmitUserInfo = async (data: IUserSignUpInput) => {
    try {
      const completeData = {
        email: userEmail,
        name: data.name,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }

      const res = await completeSignup(completeData)

      if (res.success) {
        toast.success(res.message)
        setCurrentStep('success')
      } else {
        toast.error(res.message)
      }
    } catch (err) {
      toast.error('회원가입 완료 중 오류가 발생했습니다.')
      console.error('회원가입 완료 오류:', err)
    }
  }

  // 모든 폼 초기화
  const resetAllForms = useCallback(() => {
    setCurrentStep('terms')
    setUserEmail('')
    termsForm.reset()
    emailForm.reset()
    verificationForm.reset()
    userInfoForm.reset()
  }, [termsForm, emailForm, verificationForm, userInfoForm])

  // Dialog 닫기 시 상태 초기화
  const handleDialogClose = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        resetAllForms() // 다이얼로그가 닫힐 때 항상 초기화
      }
      onOpenChange(isOpen)
    },
    [onOpenChange, resetAllForms]
  )

  // 성공 단계에서 5초 뒤 자동 닫기
  useEffect(() => {
    if (currentStep === 'success') {
      const timer = setTimeout(() => {
        handleDialogClose(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [currentStep, handleDialogClose])

  // 전체 동의 체크박스 핸들러
  const handleAllAgreed = (checked: boolean) => {
    termsForm.setValue('allAgreed', checked)
    termsForm.setValue('termsOfService', checked)
    termsForm.setValue('privacyPolicy', checked)
  }

  // 단계별 제목과 설명
  const getStepInfo = () => {
    switch (currentStep) {
      case 'terms':
        return {
          icon: <FileText className='h-5 w-5' />,
          title: '약관 동의',
          description: '서비스 이용을 위해 약관에 동의해주세요.',
        }
      case 'email':
        return {
          icon: <Mail className='h-5 w-5' />,
          title: '이메일 입력',
          description: '이메일 주소를 입력하여 인증을 시작하세요.',
        }
      case 'verification':
        return {
          icon: <Shield className='h-5 w-5' />,
          title: '이메일 인증',
          description: `인증번호를 확인해주세요!`,
        }
      case 'userInfo':
        return {
          icon: <UserPlus className='h-5 w-5' />,
          title: '정보 입력',
          description: '이름과 비밀번호를 설정해주세요.',
        }
      case 'success':
        return {
          icon: <CheckCircle className='h-5 w-5' />,
          title: '회원가입 완료',
          description: '축하합니다! 회원가입이 성공적으로 완료되었습니다.',
        }
    }
  }

  const stepInfo = getStepInfo()

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className='sm:max-w-[450px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center justify-center gap-2 mb-1 mt-4'>
            {stepInfo.icon}
            {stepInfo.title}
          </DialogTitle>
          <DialogDescription className='text-center'>{stepInfo.description}</DialogDescription>
        </DialogHeader>

        <div className='space-y-4 border-t pt-4'>
          {/* 진행 상태 표시 */}
          {currentStep !== 'success' && (
            <div className='flex justify-center mb-4'>
              <div className='flex items-center space-x-2'>
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className='flex items-center'>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium font-poppins ${
                        (currentStep === 'terms' && step === 1) ||
                        (currentStep === 'email' && step === 2) ||
                        (currentStep === 'verification' && step === 3) ||
                        (currentStep === 'userInfo' && step === 4)
                          ? 'bg-blue-600 text-white'
                          : (currentStep === 'email' && step === 1) ||
                            (currentStep === 'verification' && step <= 2) ||
                            (currentStep === 'userInfo' && step <= 3)
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 1단계: 약관 동의 */}
          {currentStep === 'terms' && (
            <Form {...termsForm}>
              <form onSubmit={termsForm.handleSubmit(onSubmitTerms)}>
                <div className='text-center p-4 bg-blue-50 rounded-lg mb-2'>
                  <Handshake className='h-8 w-8 mx-auto mb-2 text-blue-600' />
                  <p className='text-sm'>약관을 확인해주세요!</p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    약관을 체크하면 동의한 것으로 간주됩니다.
                  </p>
                </div>

                <FormField
                  control={termsForm.control}
                  name='termsOfService'
                  render={({ field }) => (
                    <FormItem className='flex items-start flex-col'>
                      <div className='bg-slate-100 rounded py-2 px-3 w-full flex items-center gap-2'>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className=''
                          />
                        </FormControl>
                        <FormLabel className='text-sm font-normal'>
                          [필수] 이용약관 동의 <SheetCondition />
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={termsForm.control}
                  name='privacyPolicy'
                  render={({ field }) => (
                    <FormItem className='flex items-start flex-col'>
                      <div className='bg-slate-100 rounded py-2 px-3 w-full flex items-center gap-2 mt-2 mb-1'>
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>

                        <FormLabel className='text-sm font-normal'>
                          [필수] 개인정보취급방침 동의 <SheetPrivacy />
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={termsForm.control}
                  name='allAgreed'
                  render={({ field }) => (
                    <FormItem className='flex items-center justify-end gap-1'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => handleAllAgreed(checked as boolean)}
                          className='mt-1'
                        />
                      </FormControl>
                      <FormLabel className='font-medium text-muted-foreground mt-1'>
                        전체 동의
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Button type='submit' className='w-full mt-6 mb-2'>
                  다음 단계
                </Button>
              </form>
            </Form>
          )}

          {/* 2단계: 이메일 입력 */}
          {currentStep === 'email' && (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onSubmitEmail)}>
                <div className='text-center p-4 bg-blue-50 rounded-lg mb-4'>
                  <Handshake className='h-8 w-8 mx-auto mb-2 text-blue-600' />
                  <p className='text-sm'>이메일을 입력해주세요!</p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    이메일은 로그인 할 때 필요합니다.
                  </p>
                </div>

                <FormField
                  control={emailForm.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-poppins'>Email</FormLabel>
                      <FormControl>
                        <Input placeholder='이메일을 입력해주세요!' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex gap-2 mt-6 mb-2'>
                  <Button
                    type='submit'
                    disabled={emailForm.formState.isSubmitting}
                    className='flex-1'
                  >
                    <Send className='h-4 w-4 mr-1' />
                    {emailForm.formState.isSubmitting ? '인증 메일 발송 중...' : '인증 메일 발송'}
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {/* 3단계: 인증번호 입력 */}
          {currentStep === 'verification' && (
            <Form {...verificationForm}>
              <form onSubmit={verificationForm.handleSubmit(onVerifyEmail)}>
                <div className='space-y-4'>
                  <div className='text-center p-4 bg-blue-50 rounded-lg'>
                    <Mail className='h-8 w-8 mx-auto mb-2 text-blue-600' />
                    <p className='text-sm'>
                      <span className='uline'>{userEmail}</span> 인증번호가 전송되었습니다.
                    </p>
                    <p className='text-xs text-muted-foreground mt-1'>
                      5분 내에 인증을 완료해주세요.
                    </p>
                  </div>

                  <FormField
                    control={verificationForm.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem className='hidden'>
                        <FormControl>
                          <Input type='hidden' {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={verificationForm.control}
                    name='verificationCode'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>인증번호</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='6자리 인증번호를 입력하세요'
                            maxLength={6}
                            className='text-center'
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\s/g, '')
                              field.onChange(value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='flex gap-2 mt-6 mb-2'>
                  <Button
                    type='submit'
                    disabled={verificationForm.formState.isSubmitting}
                    className='flex-1'
                  >
                    <Send className='h-4 w-4 mr-1' />
                    {verificationForm.formState.isSubmitting ? '인증 중...' : '인증 확인'}
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {/* 4단계: 사용자 정보 입력 */}
          {currentStep === 'userInfo' && (
            <Form {...userInfoForm}>
              <form onSubmit={userInfoForm.handleSubmit(onSubmitUserInfo)}>
                <div className='space-y-4'>
                  <div className='text-center p-4 bg-green-50 rounded-lg'>
                    <UserPlus className='h-8 w-8 mx-auto mb-2 text-green-600' />
                    <p className='text-sm text-green-800'>이메일 인증이 완료되었습니다!</p>
                    <p className='text-xs text-green-600 mt-1'>마지막 단계입니다.</p>
                  </div>

                  <FormField
                    control={userInfoForm.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='font-poppins'>Name</FormLabel>
                        <FormControl>
                          <Input placeholder='이름을 입력해주세요!' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={userInfoForm.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='font-poppins'>Password</FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            placeholder='비밀번호를 입력해주세요.'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={userInfoForm.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='font-poppins'>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            placeholder='비밀번호를 다시 입력해주세요.'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='flex mt-8 mb-2'>
                  <Button
                    type='submit'
                    disabled={userInfoForm.formState.isSubmitting}
                    className='flex-1'
                  >
                    <UserPlus className='h-4 w-4' />
                    {userInfoForm.formState.isSubmitting ? '회원가입 중...' : '회원가입 완료'}
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {/* 5단계: 성공 페이지 */}
          {currentStep === 'success' && (
            <div className='text-center space-y-4 pb-4'>
              <div className='text-center p-4 bg-green-50 rounded-lg'>
                <CheckCircle className='h-8 w-8 mx-auto mb-2 text-green-600' />
                <p className='text-sm text-green-800'>
                  회원가입이 완료되었습니다.! <br />
                  이제 모든 서비스를 이용하실 수 있습니다.
                </p>
              </div>

              <p className='text-sm text-muted-foreground'>이 창은 5초 후에 닫힙니다.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
