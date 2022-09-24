import {request} from 'umi';

export async function doWebCategoryByInformation(id?: number) {
  return request<APIResponse.Response<any>>(`/api/admin/web/categories/${id}`);
}

export async function doWebClassificationByInformation(id?: string) {
  return request<APIResponse.Response<any>>(`/api/admin/web/classifications/${id}`);
}

export async function doWebClassificationByEnable() {
  return request<APIResponse.Response<any>>('/api/admin/web/classification/enable');
}

export async function doWebProjectByInformation(id?: string) {
  return request<APIResponse.Response<any>>(`/api/admin/web/projects/${id}`);
}
