import { request } from 'umi';

export async function doList() {
  return request<APIResponse.Response<any>>('/api/admin/web/categories');
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api/admin/web/categories/${id}`, {
    method: 'DELETE',
  });
}

export async function doEnable(data: APIRequest.Enable) {
  return request<APIResponse.Response<any>>('/api/admin/web/category/enable', {
    method: 'PUT',
    data: data,
  });
}
