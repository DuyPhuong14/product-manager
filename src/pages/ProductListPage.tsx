import { useCallback, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { useFetch } from '../hooks/useFetch';
import { CATEGORIES, PAGE_SIZES, STATUS_LABEL } from '../constants/product';
import { formatDate, formatPrice } from '../utils/format';
import { getErrorMessage } from '../utils/error';
import { exportProductsToExcel } from '../utils/exportExcel';
import type { ProductInput, ProductStatus } from '../types/product';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import PageHeader from '../components/PageHeader';
import ProductForm from '../components/ProductForm';

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Đọc bộ lọc từ URL
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const q = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';
  const status = (searchParams.get('status') ?? '') as ProductStatus | '';

  const [keyword, setKeyword] = useState(q);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // State cho form thêm mới
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0); // đổi key để form được reset trắng

  const fetcher = useCallback(
    () => productService.getList({ page, limit, q, category, status }),
    [page, limit, q, category, status],
  );
  const { data, loading, error, reload } = useFetch(fetcher);

  // Cập nhật URL: giá trị rỗng thì xóa khỏi URL
  const updateParams = (changes: Record<string, string | number>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === '') next.delete(key);
      else next.set(key, String(value));
    });
    setSearchParams(next);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    updateParams({ q: keyword.trim(), page: 1 });
  };

  const handleCreate = async (values: ProductInput) => {
    try {
      setCreating(true);
      setCreateError(null);
      await productService.create(values);
      setFormKey((k) => k + 1);
      // Sản phẩm mới nằm đầu danh sách nên về trang 1
      if (page !== 1) updateParams({ page: 1 });
      else reload();
    } catch (err) {
      setCreateError(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa "${name}"?`)) return;
    try {
      setBusyId(id);
      setActionError(null);
      await productService.remove(id);
      if (data && data.data.length === 1 && page > 1) updateParams({ page: page - 1 });
      else reload();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  // Xuất toàn bộ kết quả đang lọc (không chỉ trang hiện tại)
  const handleExport = async () => {
    try {
      setExporting(true);
      setActionError(null);
      const result = await productService.getList({ page: 1, limit: 1000, q, category, status });
      exportProductsToExcel(result.data);
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setExporting(false);
    }
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / limit)) : 1;
  const hasFilter = Boolean(q || category || status);

  let content;
  if (loading) {
    content = <Loading />;
  } else if (error) {
    content = <ErrorState message={error} onRetry={reload} />;
  } else if (!data || data.data.length === 0) {
    content = (
      <EmptyState
        title={hasFilter ? 'Không tìm thấy sản phẩm phù hợp' : 'Chưa có sản phẩm nào'}
        description={
          hasFilter ? 'Hãy thử đổi từ khóa hoặc bộ lọc' : 'Hãy dùng biểu mẫu phía trên để thêm sản phẩm đầu tiên'
        }
      />
    );
  } else {
    content = (
      <>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Hình ảnh</th><th>Tên sản phẩm</th><th>Danh mục</th>
                <th>Giá (VNĐ)</th><th>Số lượng</th><th>Trạng thái</th><th>Ngày tạo</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((p, index) => (
                <tr key={p.id}>
                  <td>{(page - 1) * limit + index + 1}</td>
                  <td>
                    {p.image ? (
                      <img className="thumb" src={p.image} alt={p.name} />
                    ) : (
                      <div className="thumb thumb-empty">–</div>
                    )}
                  </td>
                  <td><Link to={`/products/${p.id}`}>{p.name}</Link></td>
                  <td>{p.category}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>{p.quantity}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>{formatDate(p.createdAt)}</td>
                  <td>
                    <div className="row-actions">
                      <Link className="btn btn-sm btn-primary" to={`/products/${p.id}/edit`}>Sửa</Link>
                      <button
                        className="btn btn-sm btn-danger"
                        disabled={busyId === p.id}
                        onClick={() => handleDelete(p.id, p.name)}
                      >
                        {busyId === p.id ? '...' : 'Xóa'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <label>
            Hiển thị{' '}
            <select value={limit} onChange={(e) => updateParams({ limit: e.target.value, page: 1 })}>
              {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>{' '}
            bản ghi mỗi trang
          </label>
          <Pagination page={page} totalPages={totalPages} onChange={(p) => updateParams({ page: p })} />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Quản lý sản phẩm"
        subtitle="Thêm mới sản phẩm và quản lý danh sách sản phẩm"
        breadcrumb={[{ label: 'Trang chủ', to: '/' }, { label: 'Sản phẩm' }]}
      />

      {/* Card 1: form thêm mới */}
      <section className="card">
        <div className="card-head">
          <div className="card-title">
            <div className="icon-box">+</div>
            <div>
              <h2>Thêm sản phẩm mới</h2>
              <p className="muted">Điền đầy đủ thông tin để thêm sản phẩm vào hệ thống</p>
            </div>
          </div>
        </div>
        {createError && <div className="alert">{createError}</div>}
        <ProductForm key={formKey} submitLabel="+ Thêm sản phẩm" submitting={creating} onSubmit={handleCreate} />
      </section>

      {/* Card 2: danh sách */}
      <section className="card">
        <div className="card-head">
          <div className="card-title">
            <div className="icon-box icon-box-green">≡</div>
            <div>
              <h2>Danh sách sản phẩm</h2>
              <p className="muted">
                {data ? `Tổng số ${data.total} sản phẩm trong hệ thống` : 'Đang tải...'}
              </p>
            </div>
          </div>
          <button
            className="btn"
            onClick={handleExport}
            disabled={exporting || !data || data.total === 0}
          >
            {exporting ? 'Đang xuất...' : '⭳ Xuất Excel'}
          </button>
        </div>

        <form className="filters" onSubmit={handleSearch}>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm theo tên sản phẩm..."
          />
          <select value={category} onChange={(e) => updateParams({ category: e.target.value, page: 1 })}>
            <option value="">Tất cả danh mục</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={status} onChange={(e) => updateParams({ status: e.target.value, page: 1 })}>
            <option value="">Tất cả trạng thái</option>
            {(Object.keys(STATUS_LABEL) as ProductStatus[]).map((s) => (
              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
          <button className="btn btn-primary" type="submit">Tìm kiếm</button>
        </form>

        {actionError && <div className="alert">{actionError}</div>}
        {content}
      </section>
    </>
  );
}