import * as XLSX from 'xlsx';
import { STATUS_LABEL } from '../constants/product';
import { formatDate } from './format';
import type { Product } from '../types/product';

export function exportProductsToExcel(products: Product[]) {
  const rows = products.map((p, index) => ({
    STT: index + 1,
    'Tên sản phẩm': p.name,
    'Danh mục': p.category,
    'Giá (VNĐ)': p.price,
    'Số lượng': p.quantity,
    'Trạng thái': STATUS_LABEL[p.status],
    'Mô tả': p.description ?? '',
    'Ngày tạo': formatDate(p.createdAt),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet['!cols'] = [
    { wch: 5 }, { wch: 28 }, { wch: 16 }, { wch: 14 },
    { wch: 10 }, { wch: 12 }, { wch: 30 }, { wch: 12 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sản phẩm');
  XLSX.writeFile(workbook, 'danh-sach-san-pham.xlsx');
}