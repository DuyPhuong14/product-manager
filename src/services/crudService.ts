import axiosClient from './axiosClient';
import type { ListResult, QueryParams, WithId } from '../types/api';

// T: kiểu entity, TCreate: kiểu khi tạo, TUpdate: kiểu khi sửa
export function createCrudService<T extends WithId, TCreate, TUpdate = Partial<TCreate>>(resource: string) {
  const url = `/${resource}`;

  return {
    async getList(params?: QueryParams): Promise<ListResult<T>> {
      const res = await axiosClient.get<T[]>(url, { params });
      const total = Number(res.headers['x-total-count'] ?? res.data.length);
      return { data: res.data, total };
    },

    async getById(id: number): Promise<T> {
      const res = await axiosClient.get<T>(`${url}/${id}`);
      return res.data;
    },

    async create(payload: TCreate): Promise<T> {
      const res = await axiosClient.post<T>(url, payload);
      return res.data;
    },

    async update(id: number, payload: TUpdate): Promise<T> {
      const res = await axiosClient.patch<T>(`${url}/${id}`, payload);
      return res.data;
    },

    async remove(id: number): Promise<void> {
      await axiosClient.delete(`${url}/${id}`);
    },
  };
}