export const formatPrice = (value: number) => new Intl.NumberFormat('vi-VN').format(value);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });