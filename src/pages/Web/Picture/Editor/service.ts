import {request} from 'umi';

export async function doCreate(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/web/picture', {
    method: 'POST',
    data: params,
  });
}

export async function doUpdate(id?: number, params?: any) {
  return request<APIResponse.Response<any>>(`/api/admin/web/pictures/${id}`, {
    method: 'PUT',
    data: params,
  });
}
