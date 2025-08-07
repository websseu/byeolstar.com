import { BookOpenText } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { useEffect, useRef } from 'react'

export default function SheetPrivacy() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.focus()
    }
  }, [])

  return (
    <Sheet>
      <SheetTrigger className='uline'>보기</SheetTrigger>
      <SheetContent side='right' className='p-6 pr-2'>
        <SheetTitle className='flex font-nanum items-center gap-2 mb-2'>
          <BookOpenText />
          개인정보취급방침
        </SheetTitle>
        <ScrollArea
          className='w-full h-[calc(100vh-70px)] pr-2'
          tabIndex={0}
          role='region'
          aria-label='개인정보취급방침'
          ref={scrollRef}
        >
          <div className='info__title'>
            <p className='mb-4 mt-4'>
              웹스토리보이(이하 &quot;회사&quot;)는 개인정보 보호를 매우
              중요하게 생각하며, 『개인정보 보호법』 등 관련 법령을 준수하고
              있습니다. 본 방침은 회사가 제공하는 서비스에 적용되며, 회사가 어떤
              정보를 수집하고, 어떻게 사용하며, 어떠한 방식으로 보호하는지를
              설명합니다.
            </p>

            <h3>제1조 (수집하는 개인정보 항목)</h3>
            <ul>
              <li>이름, 이메일 주소, 비밀번호</li>
              <li>서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보</li>
              <li>선택적으로 제공한 정보 (프로필 사진, 자기소개 등)</li>
            </ul>

            <h3>제2조 (개인정보 수집 및 이용 목적)</h3>
            <ul>
              <li>회원 가입 및 관리</li>
              <li>콘텐츠 제공 및 서비스 개선</li>
              <li>고지사항 전달 및 고객 문의 대응</li>
            </ul>

            <h3>제3조 (개인정보의 보유 및 이용 기간)</h3>
            <p>
              회원의 개인정보는 수집 및 이용 목적이 달성된 후에는 지체 없이
              파기됩니다. 단, 다음의 정보는 관련 법령에 따라 일정 기간 동안
              보존됩니다:
            </p>
            <ul>
              <li>계약 또는 청약철회 등에 관한 기록: 1년</li>
              <li>전자금융 거래에 관한 기록: 1년</li>
              <li>로그인 기록: 3개월</li>
            </ul>

            <h3>제4조 (개인정보 제3자 제공)</h3>
            <p>
              회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않으며,
              다음의 경우에만 예외로 제공합니다:
            </p>
            <ul>
              <li>이용자가 사전에 동의한 경우</li>
              <li>
                법령의 규정에 의거하거나, 수사 목적으로 정해진 절차에 따라
                요청이 있는 경우
              </li>
            </ul>

            <h3>제5조 (개인정보 보호책임자)</h3>
            <p>
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
              관련 문의사항에 성실하게 답변하겠습니다.
            </p>
            <ul>
              <li>성명: 황상연</li>
              <li>이메일: webstoryboy@naver.com</li>
            </ul>

            <h3>제6조 (개인정보의 파기절차 및 방법)</h3>
            <p>
              회사는 개인정보 보유기간의 경과 또는 처리목적 달성 후에는 해당
              정보를 지체 없이 파기합니다.
            </p>

            <h3>제7조 (이용자의 권리와 행사 방법)</h3>
            <ul>
              <li>개인정보 열람, 정정, 삭제 요청 가능</li>
              <li>이메일 또는 고객센터를 통해 요청 가능</li>
            </ul>

            <p className='mt-12 text-zinc-500'>
              ※ 본 약관은 회원가입시 즉시 적용됩니다.
            </p>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
