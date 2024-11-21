'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { jsPDF } from 'jspdf'
import { X } from 'lucide-react'
import { ImagePreview } from '@/components/ui/image-preview'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

type DragItem = {
  index: number
  id: string
  type: string
}

interface ImageCardProps {
  file: File
  index: number
  moveImage: (dragIndex: number, hoverIndex: number) => void
  removeImage: (index: number) => void
}

const ImageCard = ({ file, index, moveImage, removeImage }: ImageCardProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'image',
    item: { type: 'image', index },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  }))

  const [, drop] = useDrop(() => ({
    accept: 'image',
    hover: (item: DragItem, monitor) => {
      if (!monitor.isOver({ shallow: true })) return
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) return
      moveImage(dragIndex, hoverIndex)
      item.index = hoverIndex
    }
  }))

  return (
    <div
      ref={node => {
        drag(drop(node))
      }}
      className={`group relative aspect-square overflow-hidden rounded-lg bg-gray-100 ${
        isDragging ? 'opacity-50' : ''
      }`}
      style={{ cursor: 'move' }}
    >
      <ImagePreview
        file={URL.createObjectURL(file)}
        alt={`预览 ${index + 1}`}
        className="absolute inset-0 h-full w-full object-contain p-2"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
        <button
          onClick={e => {
            e.stopPropagation()
            removeImage(index)
          }}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-600 opacity-0 shadow-sm transition-opacity hover:bg-white hover:text-red-500 group-hover:opacity-100"
          title="删除图片"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export function ImageToPDFConverter() {
  const [images, setImages] = useState<File[]>([])
  const [converting, setConverting] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages(prev => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    noClick: false
  })

  const moveImage = useCallback((dragIndex: number, hoverIndex: number) => {
    setImages(prevImages => {
      const newImages = [...prevImages]
      const draggedImage = newImages[dragIndex]
      newImages.splice(dragIndex, 1)
      newImages.splice(hoverIndex, 0, draggedImage)
      return newImages
    })
  }, [])

  const handleConvert = async () => {
    if (images.length === 0) return

    setConverting(true)
    try {
      const doc = new jsPDF()

      for (let i = 0; i < images.length; i++) {
        const image = images[i]
        const imageUrl = URL.createObjectURL(image)

        // 如果不是第一页，添加新页
        if (i > 0) {
          doc.addPage()
        }

        // 将图片转换为base64
        const img = await loadImage(imageUrl)
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height

        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0)
        const imageData = canvas.toDataURL('image/jpeg')

        // 计算适合页面的尺寸
        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        const ratio = Math.min(pageWidth / img.width, pageHeight / img.height)

        const width = img.width * ratio
        const height = img.height * ratio
        const x = (pageWidth - width) / 2
        const y = (pageHeight - height) / 2

        doc.addImage(imageData, 'JPEG', x, y, width, height)
        URL.revokeObjectURL(imageUrl)
      }

      doc.save('converted.pdf')
    } catch (error) {
      console.error('转换失败:', error)
      alert('转换失败，请重试')
    } finally {
      setConverting(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        <div
          {...getRootProps()}
          className={`cursor-pointer border-2 border-dashed p-8 text-center transition-colors duration-200 ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500">将图片拖放到这里...</p>
          ) : (
            <p className="text-gray-500">点击或拖放图片到这里上传</p>
          )}
        </div>

        {images.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {images.map((file, index) => (
                <ImageCard key={index} file={file} index={index} moveImage={moveImage} removeImage={removeImage} />
              ))}
            </div>

            <button
              onClick={handleConvert}
              disabled={converting}
              className={`w-full rounded-lg px-4 py-2.5 font-medium transition-colors ${
                converting ? 'cursor-not-allowed bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
              } text-white`}
            >
              {converting ? '转换中...' : '转换为PDF'}
            </button>
          </div>
        )}
      </div>
    </DndProvider>
  )
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
