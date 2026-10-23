import { useCallback, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { useFetch } from '../hooks/useFetch';
import { productService } from '../services/productService';
import { getErrorMessage } from '../utils/error';
import type { ProductInput } from '../types/product';

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetcher = useCallback(() => productService.getById(productId), [productId]);
  const { data: product, loading, error, reload } = useFetch(fetcher);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!product) return <EmptyState title="Không tìm thấy sản phẩm" />;

  const handleSubmit = async (values: ProductInput) => {
    try {
      setSubmitting(true);
      setSubmitError(null);
      await productService.update(productId, values);
      navigate(`/products/${productId}`);
    } catch (err) {
      setSubmitError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  // Bỏ id/status/createdAt khỏi dữ liệu có sẵn để khớp kiểu ProductInput
  const { name, category, price, quantity, description, image } = product;

  return (
    <section className="card">
      <div className="card-head">
        <h2>Chỉnh sửa sản phẩm</h2>
        <Link className="btn" to={`/products/${productId}`}>← Quay lại</Link>
      </div>
      {submitError && <div className="alert">{submitError}</div>}
      <ProductForm
        initialValues={{ name, category, price, quantity, description, image }}
        submitLabel="Lưu thay đổi"
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </section>
  );
}