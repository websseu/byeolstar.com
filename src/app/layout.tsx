import type { Metadata } from 'next'
import './globals.css'
import localFont from 'next/font/local'
import { Poppins } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { SessionProvider } from 'next-auth/react'
import {
  APP_DESCRIPTION,
  APP_KEYWORDS,
  APP_NAME,
  APP_SITE_URL,
  APP_SLOGAN,
} from '@/lib/constants'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

const nanumSquare = localFont({
  variable: '--font-nanum',
  display: 'swap',
  src: [
    {
      path: '../../public/fonts/NanumSquareNeo-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NanumSquareNeo-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NanumSquareNeo-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NanumSquareNeo-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NanumSquareNeo-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
})

const nanumHuman = localFont({
  variable: '--font-human',
  display: 'swap',
  src: [
    {
      path: '../../public/fonts/NanumHuman-ExtraLight.woff',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NanumHuman-Light.woff',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NanumHuman-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NanumHuman-Bold.woff',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NanumHuman-ExtraBold.woff',
      weight: '800',
      style: 'normal',
    },
  ],
})

const gmarketSans = localFont({
  variable: '--font-gmarket',
  display: 'swap',
  src: [
    {
      path: '../../public/fonts/GmarketSans-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GmarketSans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GmarketSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
})

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: `${APP_NAME} | ${APP_SLOGAN}`,
  },
  description: APP_DESCRIPTION,
  keywords: APP_KEYWORDS,
  metadataBase: new URL(APP_SITE_URL),
  alternates: { canonical: APP_SITE_URL },
  icons: {
    icon: [
      { url: '/star.png', sizes: '16x16', type: 'image/png' },
      { url: '/star.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/star.png',
  },

  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: APP_SITE_URL,
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [
      {
        url: `${APP_SITE_URL}/webstoryboy.png`,
        width: 1200,
        height: 630,
        alt: `${APP_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@webstoryboy',
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [`${APP_SITE_URL}/webstoryboy.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ko' suppressHydrationWarning>
      <body
        className={`${nanumSquare.variable} ${poppins.variable} ${gmarketSans.variable} ${nanumHuman.variable}`}
      >
        <Toaster
          position='top-center'
          toastOptions={{
            classNames: {
              title: 'font-nanum font-bold',
              description: 'font-nanum text-xs',
            },
          }}
        />
        <ThemeProvider attribute='class'>
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
