import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Ghost } from 'lucide-react'

export default function NotFound() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-background px-4'>
      <Ghost className='w-16 h-16 text-gray-400 mb-4' />
      <h1 className='text-3xl font-bold mb-2 text-gray-800'>
        페이지를 찾을 수 없습니다
      </h1>
      <p className='text-gray-600 mb-6 text-center font-nanum'>
        요청하신 페이지가 존재하지 않거나, 삭제되었거나, 주소가 잘못되었습니다.
        <br />
        입력하신 경로를 다시 한 번 확인해 주세요.
      </p>
      <Link href='/'>
        <Button variant='outline'>홈으로 돌아가기</Button>
      </Link>
    </div>
  )
}
