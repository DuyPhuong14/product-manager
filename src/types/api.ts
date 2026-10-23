// Kết quả danh sách có phân trang, dùng được cho mọi loại dữ liệu T
export interface ListResult<T> {
  data: T[];
  total: number;
}

// Mọi entity đều có id
export interface WithId {
  id: number;
}

// Query params gửi lên API
export type QueryParams = Record<string, string | number | undefined>;