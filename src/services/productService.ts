import { createCrudService } from './crudService';
import { getStatus } from '../utils/product';
import type {
  Product,
  ProductCreatePayload,
  ProductUpdatePayload,
  ProductInput,
  ProductQuery,
} from '../types/product';

const crud = createCrudService<Product, ProductCreatePayload, ProductUpdatePayload>('products');

export const productService = {
  getList: ({ page, limit, q, category, status }: ProductQuery) =>
    crud.getList({
      _page: page,
      _limit: limit,
      _sort: 'createdAt',
      _order: 'desc',
      name_like: q || undefined, // chuỗi rỗng -> undefined để axios bỏ qua
      category: category || undefined,
      status: status || undefined,
    }),

  getById: crud.getById,

  create: (input: ProductInput) =>
    crud.create({
      ...input,
      status: getStatus(input.quantity),
      createdAt: new Date().toISOString(),
    }),

  update: (id: number, input: ProductInput) =>
    crud.update(id, { ...input, status: getStatus(input.quantity) }),

  remove: crud.remove,
};