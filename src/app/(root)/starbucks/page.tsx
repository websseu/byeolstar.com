import StarbucksPostsList from '@/components/starbucks/post-list'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '국내 스타벅스 매장 탐방 | 전국 특별한 스타벅스 매장들',
  description:
    '전국 각지의 특별한 스타벅스 매장들을 만나보세요! 부산, 서울, 대구 등 전국의 독특하고 아름다운 스타벅스 매장 정보와 후기를 확인하세요.',
  keywords: '스타벅스, 국내 스타벅스, 스타벅스 매장, 카페, 커피, 부산 스타벅스, 서울 스타벅스',
  openGraph: {
    title: '국내 스타벅스 매장 탐방',
    description: '전국 각지의 특별한 스타벅스 매장들을 만나보세요!',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default function StarbucksPage() {
  return (
    <section>
      <div className='mb-8 text-center'>
        <h1 className='text-4xl font-bold mb-4 font-human'>국내 스타벅스</h1>
        <p className='text-muted-foreground font-nanum'>
          전국 각지의 특별한 스타벅스 매장들을 만나보세요! <br />
          독특하고 아름다운 매장들의 이야기와 후기를 확인해보세요.
        </p>
      </div>
      <StarbucksPostsList />
    </section>
  )
}
