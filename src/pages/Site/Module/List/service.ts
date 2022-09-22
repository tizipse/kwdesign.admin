import {request} from 'umi';

export async function doList() {
  return request<APIResponse.Response<any>>('/api/admin/site/modules');
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api/admin/site/modules/${id}`, {method: 'DELETE'});
}

export async function doEnable(data: APIRequest.Enable) {
  return request<APIResponse.Response<any>>('/api/admin/site/module/enable', {method: 'PUT', data: data});
}
