import type { ProductStatus } from '../types/product';

export const CATEGORIES = ['Điện thoại', 'Laptop', 'Phụ kiện', 'Máy tính bảng', 'Đồng hồ'];

// Record<K, V>: bắt buộc phải có đủ mọi key của ProductStatus
export const STATUS_LABEL: Record<ProductStatus, string> = {
  in_stock: 'Còn hàng',
  low_stock: 'Sắp hết',
  out_of_stock: 'Hết hàng',
};

export const PAGE_SIZES = [5, 10, 20];