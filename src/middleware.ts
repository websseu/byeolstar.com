/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'

const authConfig: NextAuthConfig = {
  providers: [],
  callbacks: {
    // 로그인 직후에 user.role 을 token에 담아둡니다
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role
      return token
    },
    // 클라이언트가 세션을 요청할 때 token.role 을 session.user.role 에 복사
    async session({ session, token }) {
      if (session.user) {
        const role = token.role as string
        if (role === 'user' || role === 'admin') {
          session.user.role = role
        }
      }
      return session
    },
    // middleware 에서 호출되는 authorized: { request, auth }
    async authorized({ request, auth }) {
      const path = request.nextUrl.pathname

      // /admin 경로는 role === 'Admin' 이어야만 허용
      if (path.startsWith('/admin')) {
        return auth?.user?.role === 'admin'
      }
      // // /account 는 로그인만 돼 있으면 접근 허용
      // if (path.startsWith('/user/account')) {
      //   return !!auth
      // }
      // 그 외는 공개
      return true
    },
  },
}

export const { auth: middleware } = NextAuth(authConfig)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
