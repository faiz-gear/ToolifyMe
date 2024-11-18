import PDFConverter from '@/components/PDFConverter'

export default function PDFToImagePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">PDF 转图片</h1>
          <p className="text-muted-foreground">将 PDF 文件转换为各种图片格式，支持批量转换</p>
        </div>
        <PDFConverter />
      </div>
    </div>
  )
}
