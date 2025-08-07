'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { SignInWithGoogle } from '@/lib/actions/user.action'
import { FcGoogle } from 'react-icons/fc'

export function GoogleSignInForm() {
  const SignInButton = () => {
    const { pending } = useFormStatus()
    return (
      <Button
        disabled={pending}
        className='w-full font-nanum text-muted-foreground'
        variant='outline'
      >
        <FcGoogle />
        {pending ? '구글에 접속중...' : '구글로 로그인하기'}
      </Button>
    )
  }

  return (
    <form action={SignInWithGoogle}>
      <SignInButton />
    </form>
  )
}
