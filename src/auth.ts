import NextAuth from 'next-auth'
import type { DefaultSession } from 'next-auth'
import { connectToDatabase } from './lib/db'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import client from './lib/db/client'
import User from './lib/db/models/user.model'

import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role?: 'user' | 'admin'
      visitCount?: number
      username?: string
      provider?: 'google' | 'kakao' | 'naver' | 'github' | 'email'
    } & DefaultSession['user']
  }

  interface User {
    id: string
    role?: 'user' | 'admin'
    visitCount?: number
    username?: string
    provider?: 'google' | 'kakao' | 'naver' | 'github' | 'email'
  }

  interface JWT {
    id: string
    name?: string
    email?: string
    role?: 'user' | 'admin'
    visitCount?: number
    username?: string
    provider?: 'google' | 'kakao' | 'naver' | 'github' | 'email'
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      allowDangerousEmailAccountLinking: true,
    }),

    // Credentials 인증 방식 설정
    Credentials({
      // 로그인 시 입력 받을 필드 정의
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },

      // 로그인 시 호출되는 함수
      authorize: async (credentials) => {
        // 데이터베이스에 연결
        await connectToDatabase()

        // 입력값이 없을 경우 로그인 실패
        if (credentials == null) return null

        // 입력된 이메일과 일치하는 사용자 조회
        const user = await User.findOne({ email: credentials.email })

        // 사용자가 존재하고 비밀번호가 저장되어 있다면
        if (user && user.password) {
          // 입력된 비밀번호와 해시된 비밀번호 비교
          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          // 비밀번호가 일치하면 사용자 정보를 반환
          if (isMatch) {
            return {
              id: user._id,
              name: user.name,
              username: user.username,
              email: user.email,
              image: user.image,
              role: user.role,
              isActive: user.isActive,
              visitCount: user.visitCount,
              provider: user.provider,
            }
          }
        }

        // 인증 실패 시 null 반환
        return null
      },
    }),
  ],
  callbacks: {
    // 구글 & 깃헙 로그인 시 최초 유저 생성
    async signIn({ user, account }) {
      if (
        account &&
        (account.provider === 'google' ||
          account.provider === 'github' ||
          account.provider === 'kakao' ||
          account.provider === 'naver')
      ) {
        await connectToDatabase()
        const existing = await User.findOne({ email: user.email })
        if (!existing) {
          await User.create({
            name: user.name,
            username: user.name,
            email: user.email,
            image: user.image,
            role: 'user',
            isActive: true,
            visitCount: 0,
            emailVerified: true,
            provider: account.provider,
          })
        }
      }

      return true
    },
    // JWT 토큰에 사용자 정보 저장
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.username = user.name
        token.email = user.email
        token.role = user.role
        token.image = user.image
        token.visitCount = user.visitCount
        token.provider = user.provider
      } else if (token.id) {
        // DB에서 최신값 요청
        await connectToDatabase()
        const dbUser = await User.findById(token.id)
        if (dbUser) {
          token.visitCount = dbUser.visitCount
        }
      }
      // console.log('토큰:', token)
      return token
    },

    // 세션에서 사용자 정보 제공
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.username = token.name as string
        session.user.email = token.email as string
        session.user.role = token.role as 'user' | 'admin'
        session.user.image = token.image as string
        session.user.visitCount = token.visitCount as number
        session.user.provider = token.provider as
          | 'google'
          | 'kakao'
          | 'naver'
          | 'github'
          | 'email'
      }
      // console.log('세션:', session)
      return session
    },

    // 로그인 성공 시 리다이렉트 URL 설정
    async redirect({ baseUrl }) {
      return baseUrl
    },
  },
  events: {
    async signIn({ user /*, account, profile, isNewUser */ }) {
      await connectToDatabase()
      await User.findByIdAndUpdate(user.id, { $inc: { visitCount: 1 } })
    },
  },
})
