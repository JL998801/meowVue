<script setup>
import { defineProps } from "vue";
import ShopNavBarUser from "./ShopNavBarUser.vue";
import ShopNavBarGuest from "./ShopNavBarGuest.vue";

// ✅ 接收來自 `ShopLayout.vue` 的 `props`
const props = defineProps({
  isUserLoggedIn: Boolean,
  cartCount: Number,
  wishListCount: Number,
  notificationCount: Number,
});
</script>

<template>
  <ShopNavBarUser
    v-if="props.isUserLoggedIn"
    :cartCount="props.cartCount"
    :wishListCount="props.wishListCount"
    :notificationCount="props.notificationCount"
  />
  <ShopNavBarGuest v-else />
</template>
