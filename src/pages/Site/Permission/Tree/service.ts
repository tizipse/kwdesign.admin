import { request } from 'umi';

export async function doTree(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/site/permissions', { params });
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api/admin/site/permissions/${id}`, {
    method: 'DELETE',
  });
}
