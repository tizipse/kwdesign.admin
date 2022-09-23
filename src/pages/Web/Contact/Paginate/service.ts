import { request } from 'umi';

export async function doPaginate() {
  return request<APIResponse.Response<any>>('/api/admin/web/contacts');
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api/admin/web/contacts/${id}`, { method: 'DELETE' });
}

export async function doEnable(data: APIRequest.Enable) {
  return request<APIResponse.Response<any>>('/api/admin/web/contact/enable', {
    method: 'PUT',
    data: data,
  });
}
