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
      <body>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            zIndex: -1,
            pointerEvents: 'none',
          }}
          src="/video/background.mp4"
        />
        {children}
      </body>
    </html>
  )
}
