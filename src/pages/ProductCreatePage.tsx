import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { productService } from '../services/productService';
import { getErrorMessage } from '../utils/error';
import type { ProductInput } from '../types/product';

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: ProductInput) => {
    try {
      setSubmitting(true);
      setError(null);
      await productService.create(values);
      navigate('/products');
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <section className="card">
      <div className="card-head">
        <div>
          <h2>Thêm sản phẩm mới</h2>
          <p className="muted">Điền đầy đủ thông tin để thêm sản phẩm vào hệ thống</p>
        </div>
        <Link className="btn" to="/products">← Quay lại</Link>
      </div>
      {error && <div className="alert">{error}</div>}
      <ProductForm submitLabel="Thêm sản phẩm" submitting={submitting} onSubmit={handleSubmit} />
    </section>
  );
}