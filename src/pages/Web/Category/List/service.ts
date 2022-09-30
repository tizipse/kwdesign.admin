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

export async function doRequiredPicture(data: APIWebCategories.RequiredPicture) {
  return request<APIResponse.Response<any>>('/api/admin/web/category/is_required_picture', {
    method: 'PUT',
    data: data,
  });
}

export async function doRequiredHtml(data: APIWebCategories.RequiredHtml) {
  return request<APIResponse.Response<any>>('/api/admin/web/category/is_required_html', {
    method: 'PUT',
    data: data,
  });
}
