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
        href: '/tools/pdf/to-image',
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
      <div className="relative hidden h-screen w-72 border-r bg-muted/40 md:block">
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
          <ScrollArea className="px-1 py-2">
            {tools.slice(1).map((tool, index) =>
              'items' in tool ? (
                // 渲染有子项的分类
                <div key={index} className="py-2">
                  <h2 className="relative px-7 text-sm font-semibold tracking-tight">{tool.name}</h2>
                  <div className="space-y-1 p-2">
                    {tool.items?.map((item, itemIndex) => (
                      <Link key={itemIndex} href={item.href} passHref>
                        <Button
                          variant={pathname === item.href ? 'secondary' : 'ghost'}
                          className="w-full justify-start"
                        >
                          {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                          {item.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                // 渲染没有子项的工具
                <div key={index} className="px-3 py-2">
                  <div className="space-y-1">
                    <Link href={tool.href} passHref>
                      <Button variant={pathname === tool.href ? 'secondary' : 'ghost'} className="w-full justify-start">
                        {tool.icon && <tool.icon className="mr-2 h-4 w-4" />}
                        {tool.name}
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
