'use client'

import { ImageWatermark } from '@/components/ImageWatermark'

export default function WatermarkPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold">图片水印</h1>
        <ImageWatermark />
      </div>
    </div>
  )
}
