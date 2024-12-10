import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Halal Mate - Find Halal Restaurants in Switzerland',
  description: 'Discover authentic Halal restaurants across Switzerland with Halal Mate.',
  metadataBase: new URL('https://halal-mate.com'),
  applicationName: 'Halal Mate',
  keywords: ['halal', 'restaurants', 'switzerland', 'food', 'muslim', 'dining'],
  authors: [{ name: 'Nadjib Bennaï' }],
  creator: 'Nadjib Bennaï',
  publisher: 'Halal Mate',
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png' }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#000000'
      }
    ]
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_CH',
    url: 'https://halal-mate.com',
    title: 'Halal Mate - Find Halal Restaurants in Switzerland',
    description: 'Discover authentic Halal restaurants across Switzerland with Halal Mate.',
    siteName: 'Halal Mate',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Halal Mate - Your trusted companion for finding Halal restaurants in Switzerland'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Halal Mate - Find Halal Restaurants in Switzerland',
    description: 'Discover authentic Halal restaurants across Switzerland with Halal Mate.',
    images: ['/og-image.jpg']
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

