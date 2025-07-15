export function formatVNDPrice(price: number) {
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' VND';
} 

export function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
} 

export const unformatVND = (value: string | number): string => String(value).replace(/\D/g, '');

export const formatVNDInput = (value: number | string): string => {
  const numeric = unformatVND(value);
  return numeric ? Number(numeric).toLocaleString('vi-VN') : '';
}; 