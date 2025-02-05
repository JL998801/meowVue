import { createRouter, createWebHistory } from 'vue-router';
import Home from "@/views/Home.vue";
import NotFound from '@/views/NotFound.vue';
import Forbidden from '@/views/Forbidden.vue';
import LoginMember from '@/views/secure/LoginMember.vue';
import LoginAdmin from '@/views/secure/LoginAdmin.vue';
import AdminManagement from '@/views/AdminManagement.vue';
import { routes as shopRoutes } from "@/router/shopRoute"; // 商城的 `shopRoute.js` 路由配置
import ShopLayout from '../views/shops/ShopLayout.vue';

const routes = [
  { path: "/", component: Home, name: "home-link" },
  { path: "/:pathMatch(.*)*", component: NotFound, name: "notfound-link" },
  { path: "/403", component: Forbidden, name: "forbidden-link" },
  { path: '/secure/login', component: LoginMember, name: 'login-link' },
  { path: '/secure/loginadmin', component: LoginAdmin, name: 'login-admin-link' },
  { path: "/admin/management", component: AdminManagement, name: "admin-management-link" },
  {path:"/shop",component:ShopLayout,children:shopRoutes}, // 載入 `shopRoute.js` 的商城路由
];

const route = createRouter({
  routes: routes,
  history: createWebHistory(),
});
export default route;
