import React from 'react'

import { auth } from '@/auth'
import HeaderRightMenu from './header-right-menu'

export default async function HeaderRight() {
  const session = await auth()
  // console.log(session)

  return <HeaderRightMenu session={session} />
}
