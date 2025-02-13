import { createRouter, createWebHistory } from 'vue-router';
import useUserStore from "@/stores/user";
import Swal from "sweetalert2";
import Home from "@/views/Home.vue";
import NotFound from '@/views/NotFound.vue';
import Forbidden from '@/views/Forbidden.vue';
import LoginMember from '@/views/secure/LoginMember.vue';
import LoginAdmin from '@/views/secure/LoginAdmin.vue';
// import LostCase from '@/views/pets/lost/LostCase.vue';
import LostForm from '@/views/pets/lost/LostForm.vue';
import ReportForm from '@/views/pets/report/ReportForm.vue';
import Register from '@/views/pets/Register.vue';
import MemberCenter from '@/views/pets/MemberCenter.vue';
import MemberCard from '@/views/pets/MemberCard.vue';
import ShopLayout from '@/views/shops/ShopLayout.vue';
import { shopRoutes } from './shopRouter'; // 引入商城路由
import ShopManagement from '@/views/shops/ShopManagement.vue';
import ProductManagement from '@/views/shops/ProductManagement.vue';
import Ordersrders from '@/views/shops/Orders.vue';
import Notifications from '@/views/shops/Notifications.vue';
// import RescueCase from '@/views/pets/pet/rescue/RescueCase.vue';
// import EditRescueCase from '../views/pets/pet/rescue/EditRescueCase.vue';
// import NewRescueProgress from '../views/pets/pet/rescue/NewRescueProgress.vue';
// import RescueSearch from '@/views/pets/pet/rescue/RescueSearch.vue';
// import LineMessage from '@/views/secure/LineMessage.vue';
// import NewRescueCase from '../views/pets/pet/rescue/NewRescueCase.vue';
// import GoogleMap from '@/views/pets/pet/map/GoogleMap.vue';
//會員中心功能
import LineMessage from '@/views/secure/LineMessage.vue';
import FollowCase from '@/views/secure/FollowCase.vue';
import MemberRescueCase from '../views/secure/MemberRescueCase.vue';


//後臺頁面
import AdminManagement from '../views/AdminManagement.vue';
import RescueManagement from '@/views/admin/kuan/RescueManagement.vue';
import RescueAnalysis from '@/views/admin/kuan/RescueAnalysis.vue';



const routes = [
  { path: "/", component: Home, name: "home-link" },
  { path: "/:pathMatch(.*)*", component: NotFound, name: "notfound-link" },
  { path: "/403", component: Forbidden, name: "forbidden-link" },
  { path: '/secure/login', component: LoginMember, name: 'login-link' },
  { path: '/secure/loginadmin', component: LoginAdmin, name: 'login-admin-link' },
  { path: '/pages/Register', component: Register, name: 'register-link' },
  // { path: "/pets/lostcase", component: LostCase, name: "pets-LostCase-link" },
  { path: "/pets/lostform", component: LostForm, name: "pets-LostForm-link" },
  { path: "/pets/reportform", component: ReportForm, name: "pets-ReportForm-link" },
  { path: "/pages/MemberCenter", component: MemberCenter, name: "MemberCenter-link" },
  { path: "/pages/MemberCard", component: MemberCard, name: "MemberCard-link" },
  // { path: "/pet/rescue/search", component: RescueSearch, name: "pet-rescueSearch-link"}, 
  // { path: "/pet/rescueCase/:id", component: RescueCase, name: "pet-rescueCase-link",  props: true},  // 使用 props 傳遞參數產生動態路由(新增案件)
  // { path: "/pet/rescueCase/edit/:id", component: EditRescueCase, name: "pet-rescueCase-edit-link",  props: true},  // 使用 props 傳遞參數產生動態路由(編輯案件)
  // { path:"/member-center", component: MemberCenter, name: "member-center-link" },
  // { path:"/advanced-settings", component: LineMessage, name: "advanced-settings-link"},
  // { path:"/pet/rescue/add", component: NewRescueCase, name: "newRescueCase-link"},
  // { path:"/pet/map", component: GoogleMap, name: "googleMap-link"},
  // {path:"/pet/rescueCase/update/:id", component: NewRescueProgress, name: "newRescueProgress-link"}, // 使用 props 傳遞參數產生動態路由(編輯案件)
  { path: "/pages/Register", component: Register, name: "register-link" },
  { path: "/pets/MemberCenter", component: MemberCenter, name: "MemberCenter-link" },
  { path: "/pets/MemberCard", component: MemberCard, name: "MemberCard-link" },
  // { path: "/pet/rescue/search", component: RescueSearch, name: "pet-rescueSearch-link" },
  // { path: "/pet/rescueCase/:id", component: RescueCase, name: "pet-rescueCase-link", props: true },  // 使用 props 傳遞參數產生動態路由(新增案件)
  // { path: "/pet/rescueCase/edit/:id", component: EditRescueCase, name: "pet-rescueCase-edit-link", props: true },  // 使用 props 傳遞參數產生動態路由(編輯案件)
  // { path: "/advanced-settings", component: LineMessage, name: "advanced-settings-link" },
  // { path: "/pet/rescue/add", component: NewRescueCase, name: "newRescueCase-link" },
  // { path: "/pet/map", component: GoogleMap, name: "googleMap-link" },
  // { path: "/pet/rescueCase/update/:id", component: NewRescueProgress, name: "newRescueProgress-link" }, // 使用 props 傳遞參數產生動態路由(編輯案件)

  //會員中心功能
  { path: "/pages/Register", component: Register, name: "register-link" },
  { path: "/member-center/followCase", component: FollowCase, name: "followCase-link" },
  { path: "/member-center/rescueCase", component: MemberRescueCase, name: "memberRescueCase-link" },

  //管理員後台頁面
  //加上 meta 標記，表示這頁面不顯示導航列。
  //這樣 /admin/* 下面的所有路由都會套用 AdminManagement.vue，讓 Sidebar 固定存在！
  {
    path: "/admin", component: AdminManagement, name: "adminManagement-link", meta: { hideNavbar: true }, children: [
      { path: "rescueCase", component: RescueManagement },
      { path: "rescueAnalysis", component: RescueAnalysis },
      { path: "categories", component: ShopManagement },
      { path: "products", component: ProductManagement },
      { path: "notifications", component: Notifications },
      { path: "orders", component: Ordersrders },
    ],
  },

  //商城頁面
  {
    path: "/shop",
    component: ShopLayout, meta: { hideNavbar: true }, // ✅ 隱藏通用導覽列
    children: [...shopRoutes] // ✅ 正確展開商城子路由
  },
];

const router = createRouter({
  routes: routes,
  history: createWebHistory(),
});

// 全域前置守衛，進行用戶token驗證(持有&時效合法)
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const publicPages = [
    "/secure/login",
    "/403",
    "/",
    "/pet/rescue/search",
    "/pet/map",
    "/pets/Register",
    "/pets/MemberCenter",
    "/pets/MemberCard",
    "/adopt",
    "/secure/loginadmin",
    '/callback',
    "/shop",
    "/shop/product",  // ✅ 只匹配 `/shop/product`
  ];  // 不需要驗證的路由

  console.log("userStore", userStore);
  console.log("to.path", to.path);
  // 🔥 `/shop` 及其所有子路由都不需要驗證 (開發用byNaomi)
  // const isPublicPage = publicPages.includes(to.path) || to.path.startsWith("/shop");
  // console.log("isPublicPage", isPublicPage);
  // if (!isPublicPage && !userStore.isAuthenticated) {
  //   return next("/secure/login"); // 🔐 重新導向到登入頁
  // }
  // ✅ 改用 `.some()` 來判斷是否為公開頁面；配合部分頁面:id的設計
  const isPublicPage = publicPages.some(page => to.path.startsWith(page));

  //用來判斷救援案件頁面路徑，需要是公開
  const isRescueCaseDetail = to.path.startsWith("/pet/rescueCase/") && to.path.split("/").length === 4;


  // 需要驗證的路由，startsWith會包括上述路由所有/**`，some() 會逐個檢查 publicPages 陣列中的每個元素，確保 只要前綴匹配就視為公開頁面
  // const authRequired = !publicPages.includes(to.path) && !isRescueCaseDetail;
  const authRequired = !isPublicPage && !isRescueCaseDetail;

  if (authRequired) {
    const isValid = await userStore.validateToken();    //自定義方法檢查Token是否有效
    if (!isValid) {
      userStore.logout(); // 清除用戶資訊

      // ✅ 使用 SweetAlert2 顯示登入過期提示
      await Swal.fire({
        title: "錯誤訊息",
        text: "請先登入再使用本功能",
        icon: "warning",
        confirmButtonText: "確定"
      });

      return next("/secure/login"); // 跳轉到登入頁面
    }
  }

  next(); // 驗證成功則繼續跳轉
});

export default router;