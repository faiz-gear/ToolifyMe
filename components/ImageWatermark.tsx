'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ImagePreview } from '@/components/ui/image-preview'

export function ImageWatermark() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [watermarkText, setWatermarkText] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const drawWatermarks = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, text: string) => {
    // Configure watermark text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    const fontSize = Math.min(canvas.width * 0.08, 36)
    ctx.font = `${fontSize}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Draw multiple watermarks in random positions
    const numWatermarks = Math.floor((canvas.width * canvas.height) / 100000) // Adjust density
    for (let i = 0; i < numWatermarks; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      // Rotate each watermark slightly
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(-Math.PI / 6) // Rotate -30 degrees
      ctx.fillText(text, 0, 0)
      ctx.restore()
    }
  }

  const handleWatermarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.slice(0, 10)
    setWatermarkText(text)
    if (selectedFile) {
      generatePreview(text, selectedFile)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (watermarkText) {
        generatePreview(watermarkText, file)
      }
    }
  }

  const generatePreview = (text: string, file: File = selectedFile!) => {
    if (!file || !text) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)

      if (ctx) {
        drawWatermarks(ctx, canvas, text)
        setPreviewUrl(canvas.toDataURL('image/jpeg'))
      }
    }

    img.src = URL.createObjectURL(file)
  }

  const downloadWatermarkedImage = async () => {
    if (!selectedFile || !watermarkText) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)

      if (ctx) {
        drawWatermarks(ctx, canvas, watermarkText)
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

  const handleGenerateWatermark = async () => {
    if (!selectedFile || !watermarkText) return

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.src = URL.createObjectURL(selectedFile)
      await new Promise(resolve => {
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height

          // 绘制原始图片
          ctx!.drawImage(img, 0, 0)

          // 设置水印样式
          ctx!.fillStyle = 'rgba(255, 255, 255, 0.5)'
          ctx!.font = '48px Arial'

          // 计算对角线长度，用于确保旋转后覆盖整个图片
          const diagonal = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height)

          // 设置水印参数
          const text = watermarkText

          // 设置水印之间的间距（可以调整这个值来改变密度）
          const density = 200 // 值越小水印越密集

          // 计算需要的行数和列数
          const numRows = Math.ceil(diagonal / density)
          const numCols = Math.ceil(diagonal / density)

          // 计算实际间距，使水印均匀分布
          const xGap = diagonal / (numCols - 1)
          const yGap = diagonal / (numRows - 1)

          // 计算起始位置，使水印居中
          const startX = -diagonal / 2
          const startY = -diagonal / 2

          // 保存画布状态
          ctx!.save()

          // 移动到画布中心并旋转
          ctx!.translate(canvas.width / 2, canvas.height / 2)
          ctx!.rotate(-Math.PI / 6) // -30度

          // 绘制水印网格
          for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
              const x = startX + col * xGap
              const y = startY + row * yGap
              ctx!.fillText(text, x, y)
            }
          }

          // 恢复画布状态
          ctx!.restore()

          // 将处理后的图片转换为 base64
          const watermarkedImage = canvas.toDataURL('image/jpeg')
          setPreviewUrl(watermarkedImage)
          resolve(true)
        }
      })
    } catch (error) {
      console.error('生成水印时出错:', error)
    }
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
          <Button onClick={handleGenerateWatermark} disabled={!selectedFile || !watermarkText} className="flex-1">
            生成水印
          </Button>
          <Button onClick={downloadWatermarkedImage} disabled={!previewUrl} variant="outline" className="flex-1">
            下载
          </Button>
        </div>
        {previewUrl && (
          <div>
            <h3 className="mb-2 text-sm font-medium">水印预览</h3>
            <ImagePreview file={previewUrl!} className="max-h-[400px] object-contain" />
          </div>
        )}
      </div>
    </div>
  )
}
