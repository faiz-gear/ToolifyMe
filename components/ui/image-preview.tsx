'use client'

import React, { useState, useEffect } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Download from 'yet-another-react-lightbox/plugins/download'
import 'yet-another-react-lightbox/styles.css'

interface ImagePreviewProps {
  file: File | string
  className?: string
}

export function ImagePreview({ file, className = '' }: ImagePreviewProps) {
  const [preview, setPreview] = useState<string>('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (typeof file === 'string') {
      setPreview(file)
    } else {
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  return (
    <>
      <img
        src={preview}
        alt="预览图"
        className={`cursor-zoom-in rounded-lg object-contain ${className}`}
        onClick={() => setOpen(true)}
      />
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src: preview }]}
        plugins={[Zoom, Download]}
        render={{
          buttonDownload: () => null // 禁用默认下载按钮
        }}
      />
    </>
  )
}
