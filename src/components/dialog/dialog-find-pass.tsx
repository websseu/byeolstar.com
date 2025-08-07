import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { IEmailOnlyInput, IPasswordResetInput, IVerifyEmailInput } from '@/lib/type'
import { EmailOnlySchema, PasswordResetSchema, VerifyEmailSchema } from '@/lib/validator'
import { Mail, Send, Shield, KeyRound, CheckCircle } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { initiatePassword, resetPassword, verifyPassword } from '@/lib/actions/user.action'

type PasswordResetStep = 'email' | 'verification' | 'newPassword' | 'success'

interface DialogPwProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DialogFindPass({ open, onOpenChange }: DialogPwProps) {
  const [currentStep, setCurrentStep] = useState<PasswordResetStep>('email')
  const [userEmail, setUserEmail] = useState('')

  // 1단계: 이메일 입력 폼
  const emailForm = useForm<IEmailOnlyInput>({
    resolver: zodResolver(EmailOnlySchema),
    defaultValues: {
      email: '',
    },
  })

  // 2단계: 인증번호 확인 폼
  const verificationForm = useForm<IVerifyEmailInput>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      email: '',
      verificationCode: '',
    },
  })

  // 3단계: 새 비밀번호 설정 폼
  const passwordForm = useForm<IPasswordResetInput>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      email: '',
      verificationCode: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  // 1단계: 이메일 제출 및 인증 메일 발송
  const onSubmitEmail = async (data: IEmailOnlyInput) => {
    try {
      const res = await initiatePassword(data)

      if (res.success) {
        toast.success(`${data.email}로 인증번호가 발송되었습니다.`)
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

  // 2단계: 인증번호 확인
  const onVerifyEmail = async (data: IVerifyEmailInput) => {
    try {
      const res = await verifyPassword(data)

      if (res.success) {
        toast.success('인증번호가 확인되었습니다.')
        setCurrentStep('newPassword')
        passwordForm.setValue('email', userEmail)
        passwordForm.setValue('verificationCode', data.verificationCode)
      } else {
        toast.error(res.message)
      }
    } catch (err) {
      toast.error('인증 중 오류가 발생했습니다.')
      console.error('인증 오류:', err)
    }
  }

  // 3단계: 새 비밀번호 설정
  const onSubmitNewPassword = async (data: IPasswordResetInput) => {
    try {
      const res = await resetPassword(data)

      if (res.success) {
        toast.success('비밀번호가 성공적으로 변경되었습니다.')
        setCurrentStep('success')
      } else {
        toast.error(res.message)
      }
    } catch (err) {
      toast.error('비밀번호 변경 중 오류가 발생했습니다.')
      console.error('비밀번호 변경 오류:', err)
    }
  }

  // 모든 폼 초기화
  const resetAllForms = () => {
    setCurrentStep('email')
    setUserEmail('')
    emailForm.reset()
    verificationForm.reset()
    passwordForm.reset()
  }

  // Dialog 닫기 시 상태 초기화
  const handleDialogClose = (isOpen: boolean) => {
    onOpenChange(isOpen)
    if (!isOpen) resetAllForms()
  }

  // 성공 단계에서 5초 뒤 자동 닫기
  useEffect(() => {
    if (currentStep === 'success') {
      const timer = setTimeout(() => {
        onOpenChange(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [currentStep, onOpenChange])

  // 단계별 제목과 설명
  const getStepInfo = () => {
    switch (currentStep) {
      case 'email':
        return {
          icon: <Mail className='h-5 w-5' />,
          title: '비밀번호 찾기',
          description: '가입하신 이메일 주소를 입력해주세요.',
        }
      case 'verification':
        return {
          icon: <Shield className='h-5 w-5' />,
          title: '이메일 인증',
          description: '발송된 인증번호를 입력해주세요.',
        }
      case 'newPassword':
        return {
          icon: <KeyRound className='h-5 w-5' />,
          title: '새 비밀번호 설정',
          description: '새로운 비밀번호를 설정해주세요.',
        }
      case 'success':
        return {
          icon: <CheckCircle className='h-5 w-5' />,
          title: '비밀번호 변경 완료',
          description: '비밀번호가 성공적으로 변경되었습니다.',
        }
    }
  }

  const stepInfo = getStepInfo()

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className='sm:max-w-[450px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center justify-center gap-2 mt-4'>
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
                {[1, 2, 3].map((step) => (
                  <div key={step} className='flex items-center'>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium font-poppins ${
                        (currentStep === 'email' && step === 1) ||
                        (currentStep === 'verification' && step === 2) ||
                        (currentStep === 'newPassword' && step === 3)
                          ? 'bg-blue-600 text-white'
                          : (currentStep === 'verification' && step === 1) ||
                            (currentStep === 'newPassword' && step <= 2)
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

          {/* 1단계: 이메일 입력 */}
          {currentStep === 'email' && (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onSubmitEmail)}>
                <div className='text-center p-4 bg-blue-50 rounded-lg mb-4'>
                  <Mail className='h-8 w-8 mx-auto mb-2 text-blue-600' />
                  <p className='text-sm'>가입하신 이메일을 입력해주세요!</p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    해당 이메일로 인증번호를 발송해드립니다.
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
                    size='lg'
                  >
                    <Send className='h-4 w-4 mr-1' />
                    {emailForm.formState.isSubmitting ? '인증 메일 발송 중...' : '인증 메일 발송'}
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {/* 2단계: 인증번호 입력 */}
          {currentStep === 'verification' && (
            <Form {...verificationForm}>
              <form onSubmit={verificationForm.handleSubmit(onVerifyEmail)}>
                <div className='space-y-4'>
                  <div className='text-center p-4 bg-blue-50 rounded-lg'>
                    <Shield className='h-8 w-8 mx-auto mb-2 text-blue-600' />
                    <p className='text-sm'>
                      <span className='uline'>{userEmail}</span>로 인증번호가 전송되었습니다.
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
                    size='lg'
                  >
                    <Shield className='h-4 w-4 mr-1' />
                    {verificationForm.formState.isSubmitting ? '인증 중...' : '인증 확인'}
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {/* 3단계: 새 비밀번호 설정 */}
          {currentStep === 'newPassword' && (
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onSubmitNewPassword)}>
                <div className='space-y-4'>
                  <div className='text-center p-4 bg-green-50 rounded-lg'>
                    <KeyRound className='h-8 w-8 mx-auto mb-2 text-green-600' />
                    <p className='text-sm text-green-800'>인증이 완료되었습니다!</p>
                    <p className='text-xs text-green-600 mt-1'>새로운 비밀번호를 설정해주세요.</p>
                  </div>

                  <FormField
                    control={passwordForm.control}
                    name='newPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='font-poppins'>New Password</FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            placeholder='새 비밀번호를 입력해주세요'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='font-poppins'>Confirm Passwrod</FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            placeholder='비밀번호를 다시 입력해주세요'
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
                    disabled={passwordForm.formState.isSubmitting}
                    className='flex-1'
                    size='lg'
                  >
                    <KeyRound className='h-4 w-4 mr-1' />
                    {passwordForm.formState.isSubmitting ? '비밀번호 변경 중...' : '비밀번호 변경'}
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {/* 4단계: 성공 페이지 */}
          {currentStep === 'success' && (
            <div className='text-center space-y-4 pb-4'>
              <div className='text-center p-4 bg-green-50 rounded-lg'>
                <CheckCircle className='h-8 w-8 mx-auto mb-2 text-green-600' />
                <p className='text-sm text-green-800'>
                  비밀번호가 성공적으로 변경되었습니다! <br />
                  새로운 비밀번호로 로그인해주세요.
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
