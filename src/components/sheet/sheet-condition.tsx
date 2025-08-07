import { BookOpenText } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { useEffect, useRef } from 'react'

export default function SheetCondition() {
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
          서비스 이용약관
        </SheetTitle>
        <ScrollArea
          className='w-full h-[calc(100vh-70px)] pr-2'
          tabIndex={0}
          role='region'
          aria-label='서비스 이용약관 내용'
          ref={scrollRef}
        >
          <div className='info__title'>
            <h3>제1조 (목적)</h3>
            <p>
              본 약관은 웹스토리보이(이하 &quot;회사&quot;)가 제공하는 모든
              서비스(이하 &quot;서비스&quot;)의 이용과 관련하여 회사와 회원 간의
              권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로
              합니다.
            </p>

            <h3>제2조 (정의)</h3>
            <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
            <ul>
              <li>
                &quot;회원&quot;이라 함은 회사와 이용계약을 체결하고 서비스를
                이용하는 자를 말합니다.
              </li>
              <li>
                &quot;콘텐츠&quot;란 서비스 내에서 제공되는 모든 자료와 정보를
                의미합니다.
              </li>
              <li>
                &quot;아이디(ID)&quot;란 회원의 식별과 서비스 이용을 위해 회원이
                설정하고 회사가 승인한 문자와 숫자의 조합을 의미합니다.
              </li>
            </ul>

            <h3>제3조 (약관의 게시 및 개정)</h3>
            <p>
              회사는 본 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면
              또는 연결 화면에 게시합니다. 회사는 필요한 경우 관련 법령을
              위반하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경된 약관은
              적용일자 및 개정 사유와 함께 공지합니다.
            </p>

            <h3>제4조 (이용계약의 성립)</h3>
            <p>
              서비스 이용계약은 회원이 되고자 하는 자가 회사가 제공하는
              신청양식에 따라 정보를 입력하고 본 약관에 동의한 후 가입을
              완료함으로써 체결됩니다.
            </p>

            <h3>제5조 (서비스의 제공 및 변경)</h3>
            <p>회사는 회원에게 다음과 같은 서비스를 제공합니다.</p>
            <ul>
              <li>웹 개발 강의 콘텐츠 및 자료 제공</li>
              <li>튜토리얼 및 참고 문서 제공</li>
              <li>회원 간 커뮤니티 및 소통 공간</li>
              <li>기타 회사가 정하는 서비스</li>
            </ul>
            <p>
              회사는 서비스의 일부 또는 전부를 변경할 수 있으며, 이 경우 사전
              공지합니다.
            </p>

            <h3>제6조 (회원 탈퇴 및 이용 제한)</h3>
            <p>
              회원은 언제든지 서비스 내 제공되는 절차를 통해 탈퇴를 요청할 수
              있으며, 회사는 지체 없이 탈퇴를 처리합니다. 회원이 본 약관을
              위반한 경우, 회사는 사전 통보 없이 서비스 이용을 제한하거나 계약을
              해지할 수 있습니다.
            </p>

            <h3>제7조 (저작권 및 콘텐츠 이용)</h3>
            <p>
              회사가 제공하는 모든 콘텐츠에 대한 저작권은 회사 또는 콘텐츠
              제공자에게 있으며, 회원은 이를 무단 복제, 전송, 배포할 수
              없습니다.
            </p>

            <h3>제8조 (면책 조항)</h3>
            <p>
              회사는 천재지변, 서비스 설비의 장애 또는 기타 불가항력적 사유로
              인해 서비스를 제공할 수 없는 경우, 그에 대한 책임을 지지 않습니다.
            </p>

            <h3>제9조 (준거법 및 재판관할)</h3>
            <p>
              본 약관은 대한민국 법령에 따라 해석되며, 서비스 이용과 관련하여
              분쟁이 발생한 경우 관할 법원은 서울중앙지방법원으로 합니다.
            </p>

            <p className='mt-6 text-zinc-500'>
              ※ 본 약관은 회원가입시 즉시 적용됩니다.
            </p>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
