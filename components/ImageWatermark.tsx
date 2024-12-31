'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ImagePreview } from '@/components/ui/image-preview'

export function ImageWatermark() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [watermarkText, setWatermarkText] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(null)
    }
  }

  const handleWatermarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.slice(0, 10) // Limit to 10 characters
    setWatermarkText(text)
  }

  const generatePreview = () => {
    if (selectedFile && watermarkText) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Set canvas size to match image
        canvas.width = img.width
        canvas.height = img.height

        // Draw original image
        ctx?.drawImage(img, 0, 0)

        if (ctx) {
          // Configure watermark text
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
          ctx.font = `${Math.min(img.width * 0.1, 48)}px Arial`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'

          // Draw watermark text
          ctx.fillText(watermarkText, canvas.width / 2, canvas.height / 2)

          // Convert to data URL and set preview
          setPreviewUrl(canvas.toDataURL('image/jpeg'))
        }
      }

      img.src = URL.createObjectURL(selectedFile)
    } else {
      setPreviewUrl(null)
    }
  }

  const downloadWatermarkedImage = async () => {
    if (!selectedFile || !watermarkText) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width
      canvas.height = img.height

      // Draw original image
      ctx?.drawImage(img, 0, 0)

      if (ctx) {
        // Configure watermark text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.font = `${Math.min(img.width * 0.1, 48)}px Arial`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // Draw watermark text
        ctx.fillText(watermarkText, canvas.width / 2, canvas.height / 2)

        // Convert to blob and download
        canvas.toBlob(blob => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `watermarked-${selectedFile.name}`
            a.click()
            URL.revokeObjectURL(url)
          }
        }, 'image/jpeg')
      }
    }

    img.src = URL.createObjectURL(selectedFile)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <input type="file" accept="image/*" onChange={handleFileSelect} ref={fileInputRef} className="hidden" />
        <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
          选择图片
        </Button>
        {selectedFile && (
          <div>
            <h3 className="mb-2 text-sm font-medium">预览</h3>
            <ImagePreview file={selectedFile} className="max-h-[400px] object-contain" />
          </div>
        )}
        <input
          type="text"
          value={watermarkText}
          onChange={handleWatermarkChange}
          placeholder="输入水印文字（最多10字）"
          maxLength={10}
          className="w-full rounded-md border px-4 py-2"
        />
        <div className="flex gap-2">
          <Button onClick={generatePreview} disabled={!selectedFile || !watermarkText} className="flex-1">
            生成水印
          </Button>
          <Button onClick={downloadWatermarkedImage} disabled={!previewUrl} variant="outline" className="flex-1">
            下载
          </Button>
        </div>
        {previewUrl && (
          <div>
            <h3 className="mb-2 text-sm font-medium">水印预览</h3>
            <ImagePreview file={selectedFile!} className="max-h-[400px] object-contain" />
          </div>
        )}
      </div>
    </div>
  )
}
