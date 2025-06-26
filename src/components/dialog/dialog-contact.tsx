'use client'

import { SmilePlus, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { IContactInput } from '@/lib/type'
import { ContactSchema } from '@/lib/validator'
import { createContact } from '@/lib/actions/contact.action'

interface DialogContactProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DialogContact({ open, onOpenChange }: DialogContactProps) {
  const form = useForm<IContactInput>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      email: '',
      title: '',
      message: '',
      status: '대기중',
    },
  })

  const onSubmit = async (data: IContactInput) => {
    const res = await createContact(data)

    if (res.success) {
      toast.success('문의가 성공적으로 전송되었습니다.')
      form.reset()
      onOpenChange(false)
    } else {
      toast.error('문의 전송에 실패했습니다. 다시 시도해주세요.')
      console.error(res.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader className='border-b pb-6 my-2'>
          <DialogTitle className='flex items-center justify-center gap-2'>
            <SmilePlus className='h-5 w-5' />
            문의하기
          </DialogTitle>
          <DialogDescription className='text-center'>
            궁금한 사항은 여기서 문의하세요! 빠르게 답변해드리겠습니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-2 md:flex-row mb-4'>
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
                name='title'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='font-poppins'>Title</FormLabel>
                    <FormControl>
                      <Input placeholder='제목을 입력해주세요!' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-poppins'>Message</FormLabel>
                  <FormControl>
                    <Textarea rows={6} placeholder='문의 내용을 입력해주세요.' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-center'>
              <Button
                type='submit'
                disabled={form.formState.isSubmitting}
                className='mt-6'
                variant='destructive'
              >
                <Send />
                {form.formState.isSubmitting ? '문의 중...' : '문의하기'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
