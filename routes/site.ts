export default [
  {
    name: '模块',
    icon: 'AppstoreOutlined',
    path: '/site/module',
    access: 'routes',
    permission: 'site.module.list',
    component: '@/pages/Site/Module/List',
  },
  {
    name: '账号',
    icon: 'TeamOutlined',
    path: '/site/admin',
    access: 'routes',
    permission: 'site.admin.paginate',
    component: '@/pages/Site/Admin/Paginate',
  },
  {
    name: '角色',
    icon: 'BranchesOutlined',
    path: '/site/role',
    access: 'routes',
    permission: 'site.role.paginate',
    component: '@/pages/Site/Role/Paginate',
  },
  {
    name: '权限',
    icon: 'NodeExpandOutlined',
    path: '/site/permission',
    access: 'routes',
    permission: 'site.permission.tree',
    component: '@/pages/Site/Permission/Tree',
  },
]
