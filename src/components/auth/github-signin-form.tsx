'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { FaGithub } from 'react-icons/fa'
import { SignInWithGithub } from '@/lib/actions/user.action'

export function GithubSignInForm() {
  const SignInButton = () => {
    const { pending } = useFormStatus()
    return (
      <Button
        disabled={pending}
        className='w-full font-nanum text-muted-foreground mt-2'
        variant='outline'
      >
        <FaGithub />
        {pending ? '깃헙에 접속중...' : '깃헙으로 로그인하기'}
      </Button>
    )
  }

  return (
    <form action={SignInWithGithub}>
      <SignInButton />
    </form>
  )
}
