<template>
  <div class="container">
    <h2>新增商品</h2>
    
    <!-- 訊息提示 -->
    <div v-if="message" :class="{'alert alert-success': messageType === 'success', 'alert alert-danger': messageType === 'error'}">
      {{ message }}
    </div>

    <form @submit.prevent="uploadProduct">
      <div class="mb-3">
        <label class="form-label">商品名稱</label>
        <input type="text" class="form-control" v-model="productData.name" required />
      </div>

      <div class="mb-3">
        <label class="form-label">價格</label>
        <input type="number" class="form-control" v-model="productData.price" required />
      </div>

      <div class="mb-3">
        <label class="form-label">商品描述</label>
        <textarea class="form-control" v-model="productData.description"></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">商品分類</label>
        <select class="form-control" v-model="productData.category">
          <option value="dog">狗用品</option>
          <option value="cat">貓用品</option>
          <option value="toy">玩具</option>
          <option value="food">飼料</option>
          <option value="supplement">保健品</option>
          <option value="clean">清潔用品</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">商品圖片</label>
        <input type="file" class="form-control" @change="handleFileUpload" multiple />
      </div>

      <!-- 圖片預覽 -->
      <div class="mb-3" v-if="previewUrls.length > 0">
        <label class="form-label">圖片預覽</label>
        <div class="d-flex">
          <img v-for="(url, index) in previewUrls" :key="index" :src="url" class="img-thumbnail me-2" width="100" />
        </div>
      </div>

      <button type="submit" class="btn btn-primary">上傳商品</button>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { ProductService } from "@/services/ProductService";

export default {
  setup() {
    const productData = ref({
      name: "",
      price: "",
      description: "",
      category: "",
    });

    const selectedFiles = ref([]);
    const previewUrls = ref([]);
    const message = ref("");
    const messageType = ref("");

    const handleFileUpload = (event) => {
      const files = Array.from(event.target.files);
      selectedFiles.value = files;
      previewUrls.value = files.map(file => URL.createObjectURL(file));
    };

    const uploadProduct = async () => {
      if (!productData.value.name || !productData.value.price) {
        message.value = "商品名稱與價格為必填！";
        messageType.value = "error";
        return;
      }

      if (selectedFiles.value.length === 0) {
        message.value = "請至少上傳一張圖片！";
        messageType.value = "error";
        return;
      }

      try {
        const response = await ProductService.createProduct(productData.value, selectedFiles.value);
        message.value = "商品上傳成功！";
        messageType.value = "success";
      } catch (error) {
        message.value = "商品上傳失敗：" + error.message;
        messageType.value = "error";
      }
    };

    return { productData, selectedFiles, previewUrls, message, messageType, handleFileUpload, uploadProduct };
  }
};
</script>
