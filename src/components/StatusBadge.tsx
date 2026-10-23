import { STATUS_LABEL } from '../constants/product';
import type { ProductStatus } from '../types/product';

export default function StatusBadge({ status }: { status: ProductStatus }) {
  return <span className={`badge badge-${status}`}>{STATUS_LABEL[status]}</span>;
}