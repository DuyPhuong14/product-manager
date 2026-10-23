import { useState, type ChangeEvent, type FormEvent } from 'react';
import { CATEGORIES } from '../constants/product';
import type { ProductInput } from '../types/product';

// Trong form mọi ô input đều là string, chuyển sang number khi submit
interface FormState {
  name: string;
  category: string;
  price: string;
  quantity: string;
  description: string;
  image: string;
}
type FormErrors = Partial<Record<keyof FormState, string>>;

interface Props {
  initialValues?: ProductInput;
  submitting?: boolean;
  submitLabel: string;
  onSubmit: (values: ProductInput) => void;
}

const MAX_IMAGE_SIZE = 300 * 1024; // 300KB

function toFormState(v?: ProductInput): FormState {
  return {
    name: v?.name ?? '',
    category: v?.category ?? '',
    price: v ? String(v.price) : '',
    quantity: v ? String(v.quantity) : '',
    description: v?.description ?? '',
    image: v?.image ?? '',
  };
}

function validate(f: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!f.name.trim()) errors.name = 'Vui lòng nhập tên sản phẩm';
  if (!f.category) errors.category = 'Vui lòng chọn danh mục';

  const price = Number(f.price);
  if (!f.price || Number.isNaN(price) || price <= 0) errors.price = 'Giá phải là số lớn hơn 0';

  const qty = Number(f.quantity);
  if (f.quantity === '' || !Number.isInteger(qty) || qty < 0) errors.quantity = 'Số lượng phải là số nguyên từ 0 trở lên';

  return errors;
}

export default function ProductForm({ initialValues, submitting = false, submitLabel, onSubmit }: Props) {
  const [form, setForm] = useState<FormState>(() => toFormState(initialValues));
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, image: 'Vui lòng chọn file ảnh' }));
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((prev) => ({ ...prev, image: 'Ảnh tối đa 300KB' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: String(reader.result) }));
      setErrors((prev) => ({ ...prev, image: undefined }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit({
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      quantity: Number(form.quantity),
      description: form.description.trim(),
      image: form.image,
    });
  };

  const handleReset = () => {
    setForm(toFormState(initialValues));
    setErrors({});
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="name">Tên sản phẩm *</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Nhập tên sản phẩm" />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="field">
        <label htmlFor="category">Danh mục *</label>
        <select id="category" name="category" value={form.category} onChange={handleChange}>
          <option value="">Chọn danh mục</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.category && <span className="field-error">{errors.category}</span>}
      </div>

      <div className="field">
        <label htmlFor="price">Giá (VNĐ) *</label>
        <input id="price" name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="Nhập giá sản phẩm" />
        {errors.price && <span className="field-error">{errors.price}</span>}
      </div>

      <div className="field">
        <label htmlFor="quantity">Số lượng *</label>
        <input id="quantity" name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} placeholder="Nhập số lượng" />
        {errors.quantity && <span className="field-error">{errors.quantity}</span>}
      </div>

      <div className="field">
        <label htmlFor="description">Mô tả</label>
        <textarea id="description" name="description" rows={3} value={form.description} onChange={handleChange} placeholder="Nhập mô tả sản phẩm (tùy chọn)" />
      </div>

      <div className="field">
        <label htmlFor="image">Hình ảnh</label>
        <input id="image" type="file" accept="image/*" onChange={handleFile} />
        {form.image && <img className="thumb thumb-lg" src={form.image} alt="Xem trước" />}
        {errors.image && <span className="field-error">{errors.image}</span>}
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Đang lưu...' : submitLabel}
        </button>
        <button className="btn" type="button" onClick={handleReset} disabled={submitting}>
          Làm mới
        </button>
      </div>
    </form>
  );
}