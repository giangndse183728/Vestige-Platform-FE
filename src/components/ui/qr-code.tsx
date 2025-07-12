'use client';

import { useEffect, useRef } from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCode({ value, size = 200, className = '' }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Set background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Simple QR code generation (basic implementation)
    // In a real app, you'd use a proper QR code library like qrcode.js
    const cellSize = size / 25; // 25x25 grid
    const margin = cellSize * 2;

    // Generate a simple pattern based on the value
    const hash = value.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    ctx.fillStyle = '#000000';
    
    // Create a simple pattern
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        const shouldFill = (hash + i * 25 + j) % 3 === 0;
        if (shouldFill) {
          ctx.fillRect(
            margin + i * cellSize,
            margin + j * cellSize,
            cellSize,
            cellSize
          );
        }
      }
    }

    // Add finder patterns (simplified)
    const finderSize = cellSize * 7;
    
    // Top-left finder
    ctx.fillRect(margin, margin, finderSize, finderSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(margin + cellSize, margin + cellSize, cellSize * 5, cellSize * 5);
    ctx.fillStyle = '#000000';
    ctx.fillRect(margin + cellSize * 2, margin + cellSize * 2, cellSize * 3, cellSize * 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(margin + cellSize * 3, margin + cellSize * 3, cellSize, cellSize);

    // Top-right finder
    ctx.fillStyle = '#000000';
    ctx.fillRect(size - margin - finderSize, margin, finderSize, finderSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(size - margin - finderSize + cellSize, margin + cellSize, cellSize * 5, cellSize * 5);
    ctx.fillStyle = '#000000';
    ctx.fillRect(size - margin - finderSize + cellSize * 2, margin + cellSize * 2, cellSize * 3, cellSize * 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(size - margin - finderSize + cellSize * 3, margin + cellSize * 3, cellSize, cellSize);

    // Bottom-left finder
    ctx.fillStyle = '#000000';
    ctx.fillRect(margin, size - margin - finderSize, finderSize, finderSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(margin + cellSize, size - margin - finderSize + cellSize, cellSize * 5, cellSize * 5);
    ctx.fillStyle = '#000000';
    ctx.fillRect(margin + cellSize * 2, size - margin - finderSize + cellSize * 2, cellSize * 3, cellSize * 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(margin + cellSize * 3, size - margin - finderSize + cellSize * 3, cellSize, cellSize);

  }, [value, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={className}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
} 