export default [
  {
    name: '轮播',
    icon: 'ClusterOutlined',
    path: '/web/banner',
    access: 'routes',
    permission: 'web.banner.paginate',
    component: '@/pages/Web/Banner/Paginate',
  },
  {
    name: '栏目',
    icon: 'AppstoreAddOutlined',
    path: '/web/category',
    access: 'routes',
    permission: 'web.category.list',
    component: '@/pages/Web/Category/List',
  },
  {
    name: '联系',
    icon: 'PhoneOutlined',
    path: '/web/contact',
    access: 'routes',
    permission: 'web.contact.paginate',
    component: '@/pages/Web/Contact/Paginate',
  },
  {
    name: '设置',
    icon: 'SettingOutlined',
    path: '/web/setting',
    access: 'routes',
    permission: 'web.setting.information',
    component: '@/pages/Web/Setting',
  },
];
