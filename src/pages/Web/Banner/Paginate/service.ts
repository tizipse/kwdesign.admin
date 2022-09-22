import {request} from 'umi';

export async function doPaginate() {
  return request<APIResponse.Response<any>>('/api/admin/web/banners');
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api/admin/web/banners/${id}`, {method: 'DELETE'});
}

export async function doEnable(data: APIRequest.Enable) {
  return request<APIResponse.Response<any>>('/api/admin/web/banner/enable', {method: 'PUT', data: data});
}
