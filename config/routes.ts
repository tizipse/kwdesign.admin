import site from '../routes/site';
import web from '../routes/web';

export default [
  { path: '/login', layout: false, component: './Basic/Login' },
  { path: '/account', component: './Basic/Account' },
  // {path: '/dashboard', name: '仪盘', icon: 'DotChartOutlined', component: './Basic/Dashboard'},
  ...site,
  ...web,
  { path: '/', redirect: '/dashboard' },
  { path: '/403', component: './Errors/403' },
  { component: './Errors/404' },
];
