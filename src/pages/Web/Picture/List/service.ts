import {request} from 'umi';

export async function doPaginate() {
  return request<APIResponse.Response<any>>('/api/admin/web/pictures');
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api/admin/web/pictures/${id}`, {method: 'DELETE'});
}
