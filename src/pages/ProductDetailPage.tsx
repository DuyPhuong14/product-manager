import { useCallback, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { useFetch } from '../hooks/useFetch';
import { formatDate, formatPrice } from '../utils/format';
import { getErrorMessage } from '../utils/error';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>(); // đọc tham số :id từ URL
  const productId = Number(id);
  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetcher = useCallback(() => productService.getById(productId), [productId]);
  const { data: product, loading, error, reload } = useFetch(fetcher);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!product) return <EmptyState title="Không tìm thấy sản phẩm" />;

  const handleDelete = async () => {
    if (!window.confirm(`Bạn có chắc muốn xóa "${product.name}"?`)) return;
    try {
      setDeleting(true);
      setActionError(null);
      await productService.remove(product.id);
      navigate('/products');
    } catch (err) {
      setActionError(getErrorMessage(err));
      setDeleting(false);
    }
  };

  return (
    <section className="card">
      <div className="card-head">
        <h2>Chi tiết sản phẩm</h2>
        <Link className="btn" to="/products">← Quay lại</Link>
      </div>

      {actionError && <div className="alert">{actionError}</div>}

      <div className="detail">
        {product.image ? (
          <img className="detail-img" src={product.image} alt={product.name} />
        ) : (
          <div className="detail-img thumb-empty">Chưa có ảnh</div>
        )}
        <dl>
          <dt>Tên sản phẩm</dt><dd>{product.name}</dd>
          <dt>Danh mục</dt><dd>{product.category}</dd>
          <dt>Giá</dt><dd>{formatPrice(product.price)} VNĐ</dd>
          <dt>Số lượng</dt><dd>{product.quantity}</dd>
          <dt>Trạng thái</dt><dd><StatusBadge status={product.status} /></dd>
          <dt>Mô tả</dt><dd>{product.description || '—'}</dd>
          <dt>Ngày tạo</dt><dd>{formatDate(product.createdAt)}</dd>
        </dl>
      </div>

      <div className="form-actions">
        <Link className="btn btn-primary" to={`/products/${product.id}/edit`}>Sửa</Link>
        <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Đang xóa...' : 'Xóa'}
        </button>
      </div>
    </section>
  );
}