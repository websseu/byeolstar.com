import React from 'react'

interface UsernamePageProps {
  params: Promise<{
    username: string
  }>
}

export default async function UsernamePage({ params }: UsernamePageProps) {
  const { username } = await params
  const cleanUsername = decodeURIComponent(username).replace(/^@/, '')

  return <div>{cleanUsername}</div>
}
