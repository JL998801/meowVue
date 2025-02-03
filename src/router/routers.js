import { createRouter, createWebHistory } from 'vue-router';
import Home from "@/views/Home.vue";
import NotFound from '@/views/NotFound.vue';
import Forbidden from '@/views/Forbidden.vue';
import LoginMember from '@/views/secure/LoginMember.vue';
import LoginAdmin from '@/views/secure/LoginAdmin.vue';
import Product from '@/views/pets/products.vue';
// import LostForm from '@/views/pets/LostForm.vue';
import Products1 from '@/views/shops/products1.vue';
import AdminManagement from '@/views/AdminManagement.vue';
import Adopt from '../components/Adopt.vue';

const routes = [
  { path: "/", component: Home, name: "home-link" },
  { path: "/:pathMatch(.*)*", component: NotFound, name: "notfound-link" },
  { path: "/403", component: Forbidden, name: "forbidden-link" },
  { path: '/secure/login', component: LoginMember, name: 'login-link' },
  { path: '/secure/loginadmin', component: LoginAdmin, name: 'login-admin-link' },
  { path: "/pets/products", component: Product, name: "pets-products-link" },
  // { path: "/pets/LostForm", component: LostForm, name: "pets-LostForm-link" },
  { path: "/shops/products1", component: Products1, name: "shops-products1-link" },
  { path: "/admin/management", component: AdminManagement, name: "admin-management-link" },
  { path: "/adopt", component: Adopt, name: "adopt-link" },
];

const route = createRouter({
  routes: routes,
  history: createWebHistory(),
});
export default route;