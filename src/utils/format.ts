export function formatVNDPrice(price: number) {
  // Format with thousand separators, no currency symbol, and append ' VND'
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' VND';
} 