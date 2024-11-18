import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '在线工具集合',
  description: '便捷的在线工具集合网站'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={cn(inter.className, 'min-h-screen bg-background antialiased', 'transition-colors duration-300')}>
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
            <Sidebar className="hidden md:block" />
            <main className="flex w-full flex-col overflow-hidden p-4 md:p-6">
              <div className="animate-fade-in">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
