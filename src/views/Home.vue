<template>
    <div><h3>首頁 {{ userStore.email }}</h3></div>
    <div id="carouselExampleFade" class="carousel slide carousel-fade" data-bs-ride="carousel">
        <div class="carousel-inner">
            <div class="carousel-item active">
                <img src="../images/reportcat2.png" class="d-block w-40" alt="商城廣告1">
            </div>
            <div class="carousel-item">
                <img src="../images/petLogo.png" class="d-block w-50" alt="商城廣告2">
            </div>
            <div class="carousel-item">
                <img src="../images/lostcat5.png" class="d-block w-50" alt="商城廣告3">
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
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