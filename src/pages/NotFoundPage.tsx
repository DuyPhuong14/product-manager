import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';

export default function NotFoundPage() {
  return (
    <EmptyState title="404 - Không tìm thấy trang" description="Đường dẫn bạn truy cập không tồn tại">
      <Link className="btn btn-primary" to="/products">Về danh sách sản phẩm</Link>
    </EmptyState>
  );
}