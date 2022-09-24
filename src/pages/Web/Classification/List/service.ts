import { request } from 'umi';

export async function doList() {
  return request<APIResponse.Response<any>>('/api/admin/web/classifications');
}

export async function doDelete(id?: string) {
  return request<APIResponse.Response<any>>(`/api/admin/web/classifications/${id}`, {
    method: 'DELETE',
  });
}

export async function doEnable(data: any) {
  return request<APIResponse.Response<any>>('/api/admin/web/classification/enable', {
    method: 'PUT',
    data: data,
  });
}
