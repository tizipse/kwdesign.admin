import { request } from 'umi';

export async function doSiteModuleByEnable() {
  return request<APIResponse.Response<any>>('/api/admin/site/module/enable');
}

export async function doSiteHelperByApis(module?: number) {
  return request<APIResponse.Response<any>>('/api/admin/site/helper/apis', { params: { module } });
}

export async function doSiteRoleByEnable() {
  return request<APIResponse.Response<any>>('/api/admin/site/role/enable');
}
