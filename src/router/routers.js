import { createRouter, createWebHistory } from 'vue-router';
import Home from "@/views/Home.vue";
import NotFound from '@/views/NotFound.vue';
import Forbidden from '@/views/Forbidden.vue';
import LoginMember from '@/views/secure/LoginMember.vue';
import LoginAdmin from '@/views/secure/LoginAdmin.vue';
import Product from '@/views/pages/Products.vue';
import AdminManagement from '@/views/AdminManagement.vue';
import Adopt from '../component/Adopt.vue';

const routes = [
  { path: "/", component: Home, name: "home-link" },
  { path: "/:pathMatch(.*)*", component: NotFound, name: "notfound-link" },
  { path: "/403", component: Forbidden, name: "forbidden-link" },
  { path: '/secure/login', component: LoginMember, name: 'login-link' },
  { path: '/secure/loginadmin', component: LoginAdmin, name: 'login-admin-link' },
  { path: "/pages/products", component: Product, name: "pages-products-link" },
  { path: "/admin/management", component: AdminManagement, name: "admin-management-link" },
  { path: "/adopt", component: Adopt, name: "adopt-link" },
];
const route = createRouter({
  routes: routes,
  history: createWebHistory(),
});
export default route;
