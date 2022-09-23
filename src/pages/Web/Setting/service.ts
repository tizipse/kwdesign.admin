import { request } from 'umi';

export async function doInformation() {
  return request<APIResponse.Response<any>>('/api/admin/web/setting');
}

export async function doSave(data?: any) {
  return request<APIResponse.Response<any>>('/api/admin/web/setting', {
    method: 'PUT',
    data: data,
  });
}
