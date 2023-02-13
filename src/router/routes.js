
import { Store } from '../store/index.js';

function reqAuth(to, from, next) {
  Store.dispatch('auth/authStatus')
    .then(() => { next(); })
    .catch(() => {
      // next();
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    });
}
const routes = [
  {
    path: '/',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('pages/PageStart.vue'), beforeEnter: reqAuth },
      { path: '/users', component: () => import('pages/users/PageUsers.vue'), beforeEnter: reqAuth },
      { path: '/user/:id', component: () => import('pages/users/PageUser.vue'), beforeEnter: reqAuth },
      { path: '/login', component: () => import('pages/PageLogin.vue') },
    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}
export default routes;
