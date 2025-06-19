'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PostsManage from '@/components/admin/posts-manage'
import UsersManage from '@/components/admin/users-manage'
import CommentsManage from '@/components/admin/comments-manage'
import ContactsManage from '@/components/admin/contacts-manage'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('posts')

  return (
    <section>
      <h1 className='text-xl text-center font-nanum mb-5'>관리자</h1>

      <Tabs defaultValue='posts' value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='grid w-full grid-cols-4 mb-8'>
          <TabsTrigger value='posts'>글 관리</TabsTrigger>
          <TabsTrigger value='users'>회원 관리</TabsTrigger>
          <TabsTrigger value='contacts'>문의 관리</TabsTrigger>
          <TabsTrigger value='comments'>댓글 관리</TabsTrigger>
        </TabsList>

        <TabsContent value='posts'>
          <Card>
            <CardHeader>
              <CardTitle>글 관리</CardTitle>
              <CardDescription>
                게시글을 관리하고 수정, 삭제, 상태 변경을 할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PostsManage />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='users'>
          <Card>
            <CardHeader>
              <CardTitle>회원 관리</CardTitle>
              <CardDescription>사용자 계정을 관리하고 권한을 설정할 수 있습니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <UsersManage />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='contacts'>
          <Card>
            <CardHeader>
              <CardTitle>문의 관리</CardTitle>
              <CardDescription>문의를 검토하고 관리할 수 있습니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <ContactsManage />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='comments'>
          <Card>
            <CardHeader>
              <CardTitle>댓글 관리</CardTitle>
              <CardDescription>사용자 댓글을 검토하고 관리할 수 있습니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <CommentsManage />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}
