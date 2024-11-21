'use client'

import { ImageToPDFConverter } from '@/components/ImageToPDFConverter'

export default function ImageToPDFPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">图片转PDF工具</h1>
      <ImageToPDFConverter />
    </div>
  )
}
