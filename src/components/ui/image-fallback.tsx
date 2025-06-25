'use client';

import NextImage, { ImageProps } from 'next/image';
import { useState } from 'react';

const placeholderSrc = '/placeholder.png';

export default function ImageWithFallback({ src, ...rest }: ImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(placeholderSrc);
      setHasError(true);
    }
  };

  return <NextImage src={imgSrc} onError={handleError} {...rest} />;
} 