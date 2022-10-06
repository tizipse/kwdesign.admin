import { useCallback, useEffect, useState } from 'react';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Modal, notification, Spin } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { doLogout } from '@/services/account';
import Constants from '@/utils/Constants';

import styles from './index.less';

const AvatarDropdown = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [menus, setMenus] = useState<any[]>([]);

  const toLogin = async () => {
    const { query = {}, pathname } = history.location;
    const { redirect } = query;
    if (window.location.pathname !== Constants.Login && !redirect) {
      history.push({ pathname: Constants.Login, search: stringify({ redirect: pathname }) });
    }
  };

  const toLogout = () => {
    doLogout().then((response: APIResponse.Response<any>) => {
      if (response.code !== Constants.Success) {
        notification.error({ message: response.message });
      } else {
        localStorage.clear();
        setInitialState((s) => ({ settings: s?.settings, toAccount: s?.toAccount }));
        toLogin();
      }
    });
  };

  const onMenu = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        Modal.confirm({
          title: '登出',
          content: '确定要推出该账号吗？',
          centered: true,
          onOk: toLogout,
        });
      } else {
        history.push(`/${key}`);
      }
    },
    [setInitialState],
  );

  useEffect(() => {
    if (initialState?.account) {
      const items: any[] = [
        { key: 'account', label: '个人中心', icon: <UserOutlined /> },
        { key: 'logout', label: '退出登录', icon: <LogoutOutlined /> },
      ];
      setMenus(items);
    }
  }, [initialState?.account]);

  const RenderLoading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
    </span>
  );

  return initialState?.account ? (
    <HeaderDropdown
      overlay={<Menu className={styles.menu} selectedKeys={[]} items={menus} onClick={onMenu} />}
    >
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          src={initialState?.account?.avatar}
          style={{ color: '#fff', backgroundColor: initialState?.settings?.primaryColor }}
          alt={initialState?.account?.nickname}
        >
          {initialState?.account?.nickname?.slice(0, 1)}
        </Avatar>
        <span className={`${styles.name} action`}>{initialState?.account?.nickname}</span>
      </span>
    </HeaderDropdown>
  ) : (
    { RenderLoading }
  );
};

export default AvatarDropdown;
