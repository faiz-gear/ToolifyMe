import React, { useState, useCallback } from 'react'
import imageCompression from 'browser-image-compression'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { ImagePreview } from './ui/image-preview'
import { ScrollArea } from './ui/scroll-area'
import { Slider } from './ui/slider'

export const ImageCompressor = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const [compressedImage, setCompressedImage] = useState<File | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [quality, setQuality] = useState([0.6]) // 默认压缩质量60%

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setOriginalImage(file)
      setCompressedImage(null)
    }
  }

  const handleQualityChange = (newQuality: number[]) => {
    setQuality(newQuality)
    setCompressedImage(null)
  }

  const compressImage = useCallback(async () => {
    if (!originalImage) return

    try {
      setIsCompressing(true)
      const options = {
        maxSizeMB: Math.max(1, (originalImage.size / (1024 * 1024)) * quality[0]), // 根据质量动态调整目标大小
        maxWidthOrHeight: 3840,
        useWebWorker: true,
        quality: quality[0],
        initialQuality: quality[0], // 添加初始质量设置
        alwaysKeepResolution: true, // 保持分辨率
        fileType: 'image/jpeg' // 指定输出格式
      }

      const compressedFile = await imageCompression(originalImage, options)
      setCompressedImage(compressedFile)
    } catch (error) {
      console.error('压缩失败:', error)
    } finally {
      setIsCompressing(false)
    }
  }, [originalImage, quality])

  const handleDownload = useCallback(() => {
    if (!compressedImage) return
    const link = document.createElement('a')
    link.href = URL.createObjectURL(compressedImage)
    link.download = `compressed_${compressedImage.name}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [compressedImage])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  // 计算压缩比例
  const getCompressionRatio = (original: number, compressed: number) => {
    return ((1 - compressed / original) * 100).toFixed(1)
  }

  return (
    <div className="grid h-[calc(100vh-2rem)] grid-cols-1 gap-4 lg:grid-cols-2">
      {/* 左侧面板 */}
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle>图片压缩</CardTitle>
          <CardDescription>选择图片进行压缩，压缩后可预览和下载</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="flex h-full flex-col gap-4">
            <div className="space-y-4 rounded-lg border p-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">选择图片</h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="w-full cursor-pointer rounded-md text-sm file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-secondary/80"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">压缩质量</h3>
                <div className="space-y-4">
                  <Slider
                    value={quality}
                    onValueChange={handleQualityChange}
                    min={0.1}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    当前质量：{Math.round(quality[0] * 100)}%{compressedImage && ' (需要重新压缩)'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium">操作</h3>
                <div className="flex gap-2">
                  <Button onClick={compressImage} disabled={!originalImage || isCompressing} className="flex-1">
                    {isCompressing ? '压缩中...' : '压缩'}
                  </Button>
                  <Button onClick={handleDownload} disabled={!compressedImage} variant="outline" className="flex-1">
                    下载压缩后的图片
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-auto">
              {originalImage && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">原图信息</h3>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">文件名：{originalImage.name}</p>
                    <p className="text-sm text-muted-foreground">大小：{formatFileSize(originalImage.size)}</p>
                  </div>
                </div>
              )}

              {compressedImage && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">压缩后信息</h3>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">文件名：compressed_{compressedImage.name}</p>
                    <p className="text-sm text-muted-foreground">大小：{formatFileSize(compressedImage.size)}</p>
                    <p className="text-sm text-muted-foreground">
                      压缩率：{getCompressionRatio(originalImage!.size, compressedImage.size)}%
                    </p>
                    <p className="text-sm text-muted-foreground">压缩质量：{Math.round(quality[0] * 100)}%</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 右侧预览面板 */}
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle>预览</CardTitle>
          <CardDescription>查看原图和压缩后的效果对比</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full">
            <div className="space-y-6 p-6">
              {originalImage && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">原图预览</h3>
                  <div className="overflow-hidden rounded-lg border">
                    <ImagePreview file={originalImage} className="max-h-[500px] w-full object-contain" />
                  </div>
                  <p className="text-sm text-muted-foreground">大小：{formatFileSize(originalImage.size)}</p>
                </div>
              )}
              {compressedImage && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">压缩后预览</h3>
                  <div className="overflow-hidden rounded-lg border">
                    <ImagePreview file={compressedImage} className="max-h-[500px] w-full object-contain" />
                  </div>
                  <p className="text-sm text-muted-foreground">大小：{formatFileSize(compressedImage.size)}</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
