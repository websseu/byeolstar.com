'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { IUserSignInInput } from '@/lib/type'
import { UserSignInSchema } from '@/lib/validator'
import { signInWithCredentials } from '@/lib/actions/user.action'
import { AlarmClock, Eye, EyeOff, Send } from 'lucide-react'
import SeparatorWithOr from '../ui/separator-or'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { GoogleSignInForm } from '../auth/google-signin-form'
import { GithubSignInForm } from '../auth/github-signin-form'

interface DialogSigninProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DialogSignin({ open, onOpenChange }: DialogSigninProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  // 폼 상태 관리
  const form = useForm<IUserSignInInput>({
    resolver: zodResolver(UserSignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // 폼 제출 핸들러
  const onSubmit = async (data: IUserSignInInput) => {
    try {
      const response = await signInWithCredentials(data)

      if (response.success) {
        toast.success('로그인에 성공했습니다!')
        form.reset()
        onOpenChange(false)
        router.refresh()
      } else {
        toast.error('이메일 또는 비밀번호가 일치하지 않습니다.')
      }
    } catch (error) {
      toast.error('로그인 중 오류가 발생했습니다. 관리자에게 문의하세요!.')
      console.error('Login error:', error)
    }
  }

  // 다이얼로그가 닫힐 때 폼 초기화
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
      setShowPassword(false)
    }
    onOpenChange(open)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-[450px] pb-6'>
          <DialogHeader className='border-b pb-6'>
            <DialogTitle className='flex items-center font-black text-green-700 justify-center gap-1 text-xl'>
              <AlarmClock className='h-5 w-5' />
              로그인
            </DialogTitle>
            <DialogDescription className='text-center'>
              로그인을 하시면 다양한 서비스를 만날 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>이메일</FormLabel>
                      <FormControl>
                        <Input placeholder='이메일을 입력해주세요!' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>패스워드</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='비밀번호를 입력하세요!'
                            {...field}
                          />
                          <button
                            type='button'
                            onClick={() => setShowPassword((v) => !v)}
                            className='eye'
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='text-center w-full'>
                  <Button
                    type='submit'
                    className='w-full bg-green-700 hover:bg-green-800'
                    disabled={form.formState.isSubmitting}
                  >
                    <Send /> {form.formState.isSubmitting ? '로그인 중...' : '로그인'}
                  </Button>
                </div>
              </div>
            </form>
          </Form>

          <SeparatorWithOr />

          <div>
            <GoogleSignInForm />
            <GithubSignInForm />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
