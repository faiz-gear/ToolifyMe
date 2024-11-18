'use client'

import { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { cn } from '@/lib/utils'

interface ImagePreviewProps {
  src: string
  alt: string
  className?: string
}

export function ImagePreview({ src, alt, className }: ImagePreviewProps) {
  return (
    <Zoom>
      <img
        src={src}
        alt={alt}
        className={cn('cursor-zoom-in hover:opacity-90 transition-opacity object-contain w-full h-auto', className)}
      />
    </Zoom>
  )
}
