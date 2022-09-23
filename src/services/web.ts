import { request } from 'umi';

export async function doWebCategoryByInformation(id?: number) {
  return request<APIResponse.Response<any>>(`/api/admin/web/categories/${id}`);
}
