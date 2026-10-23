export type ProductStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  image?: string;
  status: ProductStatus;
  createdAt: string;
}

// Dữ liệu người dùng nhập từ form
export type ProductInput = Omit<Product, 'id' | 'status' | 'createdAt'>;

// Dữ liệu gửi lên API khi tạo mới
export type ProductCreatePayload = Omit<Product, 'id'>;

// Dữ liệu gửi lên API khi sửa (chỉ cần một phần)
export type ProductUpdatePayload = Partial<ProductCreatePayload>;

// Tham số tìm kiếm / lọc / phân trang của màn danh sách
export interface ProductQuery {
  page: number;
  limit: number;
  q?: string;
  category?: string;
  status?: ProductStatus | '';
}