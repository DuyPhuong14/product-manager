import type { ProductStatus } from '../types/product';

export function getStatus(quantity: number): ProductStatus {
  if (quantity <= 0) return 'out_of_stock';
  if (quantity <= 5) return 'low_stock';
  return 'in_stock';
}