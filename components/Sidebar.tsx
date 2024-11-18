'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileText, Home, Settings } from 'lucide-react'

const tools = [
  {
    name: '首页',
    href: '/',
    icon: Home
  },
  {
    name: 'PDF 工具',
    items: [
      {
        name: 'PDF 转图片',
        href: '/tools/pdf-to-image',
        icon: FileText
      }
      // 可以在这里添加更多 PDF 相关工具
    ]
  }
  // 可以在这里添加更多工具分类
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn('pb-12', className)} {...props}>
      <div className="relative hidden h-screen border-r bg-muted/40 md:block w-72">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="flex h-12 items-center justify-start px-4">
              <h2 className="text-lg font-semibold tracking-tight">在线工具集合</h2>
            </div>
          </div>
          <div className="px-3 py-2">
            <div className="space-y-1">
              <Link href="/" passHref>
                <Button variant={pathname === '/' ? 'secondary' : 'ghost'} className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  首页
                </Button>
              </Link>
            </div>
          </div>
          <div className="py-2">
            <h2 className="relative px-7 text-sm font-semibold tracking-tight">PDF 工具</h2>
            <ScrollArea className="px-1 py-2">
              <div className="space-y-1 p-2">
                <Link href="/tools/pdf-to-image" passHref>
                  <Button
                    variant={pathname === '/tools/pdf-to-image' ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    PDF 转图片
                  </Button>
                </Link>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
