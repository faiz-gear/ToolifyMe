'use client'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { getAllTools } from '@/config/tools'

export default function Home() {
  const tools = getAllTools()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">欢迎使用在线工具集合</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.slice(1).map((tool, index) => (
          <Link key={index} href={tool.href}>
            <Card className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardHeader>
                <tool.icon className="h-8 w-8 text-muted-foreground" />
                <CardTitle className="mt-4">{tool.name}</CardTitle>
                {tool.description && <CardDescription>{tool.description}</CardDescription>}
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
