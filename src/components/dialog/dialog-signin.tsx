'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Coffee, Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IUserSignInInput } from '@/lib/type'
import { UserSignInSchema } from '@/lib/validator'
import { signInWithCredentials } from '@/lib/actions/user.action'
import { toast } from 'sonner'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
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

interface DialogSigninProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DialogSignin({ open, onOpenChange }: DialogSigninProps) {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const form = useForm<IUserSignInInput>({
    resolver: zodResolver(UserSignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: IUserSignInInput) => {
    try {
      const response = await signInWithCredentials(data)

      if (response.success) {
        toast.success('로그인에 성공했습니다!')
        form.reset()
        onOpenChange(false)
        router.refresh()
      } else {
        toast.error('로그인에 실패했습니다. 다시 시도해주세요.')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('로그인 중 오류가 발생했습니다. 나중에 다시 시도해주세요.')
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[450px] pb-8'>
          <DialogHeader className='border-b pb-6 my-2'>
            <DialogTitle className='flex items-center justify-center gap-2'>
              <Coffee className='h-5 w-5' />
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
                      <FormLabel className='font-poppins'>Email</FormLabel>
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
                      <FormLabel className='font-poppins'>Password</FormLabel>
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
                    size='lg'
                    className='w-full'
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? '로그인 중...' : '로그인'}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
