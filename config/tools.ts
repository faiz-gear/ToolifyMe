import { FileText, Home, Image } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

export interface ToolItem {
  name: string
  href: string
  icon: LucideIcon
  description?: string
}

interface ToolCategory {
  name: string
  items?: ToolItem[]
}

type Tool = ToolItem | ToolCategory

export const tools: Tool[] = [
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
        icon: FileText,
        description: '将 PDF 文件转换为高质量图片，支持 PNG、JPEG 格式'
      }
    ]
  },
  {
    name: '图片工具',
    items: [
      {
        name: '图片压缩',
        href: '/tools/image/compress',
        icon: Image,
        description: '在线压缩图片，可调节压缩质量，支持批量处理'
      },
      {
        name: '图片转pdf',
        href: '/tools/image/to-pdf',
        icon: FileText,
        description: '将图片转换为pdf文件，支持批量处理'
      },
      {
        name: '图片水印',
        href: '/tools/image/watermark',
        icon: Image,
        description: '为图片添加文字水印，支持自定义文字内容'
      }
    ]
  }
]

// 获取所有工具项（扁平化）
export const getAllTools = () => {
  return tools.reduce<ToolItem[]>((acc, tool) => {
    if ('items' in tool) {
      return [...acc, ...(tool.items || [])]
    }
    if ('href' in tool) {
      return [...acc, tool]
    }
    return acc
  }, [])
}
