<template>
    <div><h3>首頁 {{ userStore.email }}</h3></div>
    <div>
        <button>救援通報</button>
        <button>認養通報</button>
        <button>遺失通報</button>
        <button>寵物商城</button>
        <button>救援活動</button>
    </div>
</template>
<script setup>
    import useUserStore from "@/stores/user.js";
    const userStore = useUserStore();
</script>