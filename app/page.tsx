'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { FileText } from 'lucide-react'

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">欢迎使用在线工具集合</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/tools/pdf-to-image">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader>
              <FileText className="h-8 w-8 text-muted-foreground" />
              <CardTitle className="mt-4">PDF 转图片</CardTitle>
              <CardDescription>将 PDF 文件转换为高质量图片，支持 PNG、JPEG 格式</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
