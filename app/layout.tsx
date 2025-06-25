import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gumball Quiz',
  description: 'With much love and less effort, Syl',
  generator: 'me :)',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
