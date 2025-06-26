import React from 'react'
import { BadgeCheck } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { checkEmailExists } from '@/lib/actions/user.action'
import { toast } from 'sonner'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

interface DialogEmailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const schema = z.object({
  email: z.string().email('유효한 이메일 형식이 아닙니다.'),
})

export default function DialogFindEmail({ open, onOpenChange }: DialogEmailProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (values: { email: string }) => {
    const res = await checkEmailExists(values.email)

    if (res.success) {
      toast.success(`${values.email} 주소는 가입된 이메일입니다.`)
    } else {
      toast.error(`${values.email} 주소는 존재하지 않습니다.`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[450px] pb-8'>
        <DialogHeader className='border-b pb-4 my-2'>
          <DialogTitle className='flex items-center justify-center gap-2'>
            <BadgeCheck className='h-5 w-5' />
            이메일 찾기
          </DialogTitle>
          <DialogDescription className='text-center'>이메일을 입력해주세요!</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='flex gap-2 mb-1'>
                      <Input {...field} className='flex-1' placeholder='이메일을 입력하세요' />
                      <Button type='submit' className='h-10' disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? '확인 중...' : '확인'}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
