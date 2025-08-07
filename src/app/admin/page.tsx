'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AdminPosts from '@/components/admin/admin-posts'
import AdminStores from '@/components/admin/admin-stores'
import AdminContacts from '@/components/admin/admin-contacts'
import AdminUsers from '@/components/admin/admin-users'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('posts')

  return (
    <section>
      <div>
        <h1 className='text-xl text-center font-nanum mb-6 mt-4'>관리자</h1>
      </div>

      <Tabs defaultValue='posts' value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='mx-auto mb-2'>
          <TabsTrigger className='px-6' value='posts'>
            글 관리
          </TabsTrigger>
          <TabsTrigger className='px-6' value='stores'>
            스토어 관리
          </TabsTrigger>
          <TabsTrigger className='px-6' value='contacts'>
            문의 관리
          </TabsTrigger>
          <TabsTrigger className='px-6' value='users'>
            회원 관리
          </TabsTrigger>
        </TabsList>

        <TabsContent value='posts'>
          <AdminPosts />
        </TabsContent>

        <TabsContent value='stores'>
          <AdminStores />
        </TabsContent>

        <TabsContent value='contacts'>
          <AdminContacts />
        </TabsContent>

        <TabsContent value='users'>
          <AdminUsers />
        </TabsContent>
      </Tabs>
    </section>
  )
}
