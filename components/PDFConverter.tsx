'use client'

import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { FileUp, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import * as pdfjsLib from 'pdfjs-dist'
import { ImagePreview } from '@/components/ui/image-preview'
import { saveAs } from 'file-saver'

// 设置 PDF.js worker 路径
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

interface PreviewImage {
  url: string
  pageNumber: number
  width: number
  height: number
}

export default function PDFConverter() {
  const [progress, setProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageFormat, setImageFormat] = useState<'jpeg' | 'png'>('jpeg')
  const [imageQuality, setImageQuality] = useState(0.9)
  const [scale] = useState(2)

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    await handleFile(file)
  }

  const handleFile = async (file: File) => {
    if (!file.type.includes('pdf')) {
      alert('请选择 PDF 文件')
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setPreviewImages([])

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
      const totalPages = pdf.numPages
      const newPreviewImages: PreviewImage[] = []

      for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber)
        const viewport = page.getViewport({ scale: scale })
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d', { alpha: false })

        const pixelRatio = window.devicePixelRatio || 1
        canvas.width = viewport.width * pixelRatio
        canvas.height = viewport.height * pixelRatio
        canvas.style.width = viewport.width + 'px'
        canvas.style.height = viewport.height + 'px'

        context!.scale(pixelRatio, pixelRatio)
        context!.fillStyle = '#ffffff'
        context!.fillRect(0, 0, viewport.width, viewport.height)

        await page.render({
          canvasContext: context!,
          viewport: viewport,
          background: 'white'
        }).promise

        const imageUrl = canvas.toDataURL(`image/${imageFormat}`, imageQuality)
        newPreviewImages.push({
          url: imageUrl,
          pageNumber,
          width: viewport.width,
          height: viewport.height
        })

        setProgress(Math.round((pageNumber / totalPages) * 100))
      }

      setPreviewImages(newPreviewImages)
    } catch (error) {
      console.error('PDF 处理错误:', error)
      alert('PDF 处理失败，请重试')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDownload = (imageUrl: string, pageNumber: number) => {
    const format = imageFormat === 'jpeg' ? 'jpg' : 'png'
    saveAs(imageUrl, `page-${pageNumber}.${format}`)
  }

  const handleDownloadAll = () => {
    previewImages.forEach(image => {
      const format = imageFormat === 'jpeg' ? 'jpg' : 'png'
      saveAs(image.url, `page-${image.pageNumber}.${format}`)
    })
  }

  return (
    <Card className="mx-auto w-full max-w-5xl">
      <CardHeader>
        <CardTitle>PDF 转图片</CardTitle>
        <CardDescription>将 PDF 文件转换为图片格式（支持 JPG、PNG）</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
          <Button
            onClick={handleFileSelect}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'h-32 w-full max-w-sm border-2 border-dashed transition-colors duration-200',
              isDragging && 'border-primary bg-primary/10',
              isProcessing && 'cursor-not-allowed opacity-50'
            )}
            variant="outline"
            disabled={isProcessing}
          >
            <div className="flex flex-col items-center gap-2">
              <FileUp className="h-8 w-8" />
              <span>{isProcessing ? '处理中...' : '点击选择 PDF 文件'}</span>
              <span className="text-xs text-muted-foreground">{isProcessing ? '请稍候' : '或将文件拖放到此处'}</span>
            </div>
          </Button>

          <div className="flex w-full max-w-sm gap-4">
            <select
              value={imageFormat}
              onChange={e => setImageFormat(e.target.value as 'jpeg' | 'png')}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="jpeg">JPG</option>
              <option value="png">PNG</option>
            </select>
            <select
              value={imageQuality}
              onChange={e => setImageQuality(Number(e.target.value))}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="0.7">普通质量</option>
              <option value="0.9">高质量</option>
              <option value="1">最佳质量</option>
            </select>
          </div>
        </div>

        {(progress > 0 || isProcessing) && (
          <div className="mx-auto w-full max-w-sm">
            <Progress value={progress} className="h-2" />
            <p className="mt-2 text-center text-sm">处理进度：{progress}%</p>
          </div>
        )}

        {previewImages.length > 0 && (
          <div className="w-full space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-2">
              <h3 className="text-lg font-semibold">预览图片</h3>
              <div className="flex flex-wrap items-center gap-4">
                <p className="text-sm text-muted-foreground">共 {previewImages.length} 页，点击图片可放大查看</p>
                <Button variant="outline" size="sm" onClick={handleDownloadAll}>
                  <Download className="mr-2 h-4 w-4" />
                  下载全部
                </Button>
              </div>
            </div>

            <div className="grid max-h-[calc(100vh-24rem)] grid-cols-1 gap-4 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
              {previewImages.map(image => (
                <div
                  key={image.pageNumber}
                  className="group relative overflow-hidden rounded-lg border bg-muted/30 shadow-sm transition-shadow hover:shadow-md"
                >
                  <ImagePreview
                    file={image.url}
                    alt={`Page ${image.pageNumber}`}
                    className="aspect-[3/4] h-auto w-full bg-white object-contain"
                  />
                  <div className="absolute left-0 right-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent p-2 text-white">
                    <span className="text-sm font-medium">第 {image.pageNumber} 页</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-white opacity-0 transition-opacity hover:bg-white/20 hover:text-white group-hover:opacity-100"
                      onClick={() => handleDownload(image.url, image.pageNumber)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
