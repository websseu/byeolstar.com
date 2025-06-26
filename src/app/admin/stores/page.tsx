import StoresManage from '@/components/admin/stores-manage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

export default function StoresPage() {
  return (
    <section>
      <h1 className='text-xl text-center font-nanum mb-6'>스토어 관리</h1>
      <Card>
        <CardHeader>
          <CardTitle>점포 관리</CardTitle>
          <CardDescription>점포를 관리하고 수정, 삭제, 상태 변경을 할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <StoresManage />
        </CardContent>
      </Card>
    </section>
  )
}
