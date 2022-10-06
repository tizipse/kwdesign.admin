import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import { Menu, Spin } from 'antd';
import { doModule, doPermission } from '@/services/account';
import Constants from '@/utils/Constants';
import routes from '../../../config/routes';

const Header = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const [loading, setLoading] = useState<boolean>();
  const [modules, setModels] = useState<API.Module[]>([]);

  const toRoute = (items: any[], module: string, permissions: string[]) => {
    let temp: string = '';

    for (const item of items) {
      if (item?.routes) {
        temp = toRoute(item.routes, module, permissions);
        if (temp) return temp;
      } else if (item.path && item.path.startsWith(`/${module}`)) {
        for (const val of permissions) {
          if (
            (!item.access && !item.permission) ||
            (item.access == 'routes' && item.permission == val)
          ) {
            return item.path;
          }
        }
      }
    }

    return temp;
  };

  const toModules = () => {
    setLoading(true);
    doModule()
      .then((response: APIResponse.Response<API.Module[]>) => {
        if (response.code == Constants.Success) {
          setModels(response.data);
          if (response.data.length > 0) {
            const paths = history.location.pathname.split('/');

            let slug = response.data[0].slug;
            let id = response.data[0].id;

            if (paths.length >= 2) {
              response.data.forEach((item) => {
                if (item.slug === paths[1]) {
                  slug = item.slug;
                  id = item.id;
                }
              });
            }

            setInitialState({ ...initialState, module: id, module_key: slug });
          }
        }
      })
      .finally(() => setLoading(false));
  };

  const toPermissions = () => {
    doPermission(initialState?.module).then((response: APIResponse.Response<string[]>) => {
      if (response.code === Constants.Success) {
        const permissions: string[] = [];
        if (response.data) {
          response.data.forEach((item) => permissions.push(`${initialState?.module_key}.${item}`));
        }
        setInitialState({ ...initialState, permissions });
      }
    });
  };

  const onClick = (event: any) => {
    const { key } = event;
    if (key != initialState?.module && modules) {
      modules.forEach((item) => {
        if (item.id == key)
          setInitialState({ ...initialState, module: item.id, module_key: item.slug });
      });
    }
  };

  useEffect(() => {
    if (
      initialState?.module_key &&
      !history.location.pathname.startsWith(`/${initialState?.module_key}`) &&
      initialState?.permissions &&
      initialState?.permissions.length > 0
    ) {
      const route = toRoute(routes, initialState?.module_key, initialState?.permissions);
      if (route) history.push(route);
    }
  }, [initialState?.module_key, initialState?.permissions]);

  useEffect(() => {
    if (initialState?.module) {
      toPermissions();
    }
  }, [initialState?.module]);

  useEffect(() => {
    if (modules.length <= 0) toModules();
  }, []);

  return loading ? (
    <Spin />
  ) : (
    <Menu
      mode="horizontal"
      activeKey={`${initialState?.module}`}
      onClick={onClick}
      theme={initialState?.settings?.headerTheme || 'light'}
      items={modules.map((item) => ({ key: item.id, label: item.name }))}
    />
  );
};

export default Header;
