import { axiosapi, uploadFile, jsonRequest } from "@/plugins/axios";

const API_URL = "/products";

export const ProductService = {
  /**
   * 取得分頁商品數據
   * @param {number} page 當前頁碼 (預設 0)
   * @param {number} size 每頁商品數量 (預設 10)
   * @param {string} sortBy 排序字段 (預設 "productName")
   * @param {string} order 排序方式 ("asc" 或 "desc")
   */

  async getPagedProducts(page = 0, size = 10, sortBy = "productName", order = "asc") {
    return jsonRequest("get", `${API_URL}/paged?page=${page}&size=${size}&sortBy=${sortBy}&order=${order}`);
  },

  async getAllProducts() {
    return jsonRequest("get", API_URL);
  },

  async getProductById(id) {
    return jsonRequest("get", `${API_URL}/${id}`);
  },

  async searchProducts(searchParams) {
    return jsonRequest("post", `${API_URL}/search`, searchParams);
  },

  // ✅ 商品增刪改
  async addProduct(newProduct) {
    try {
        // const formData = new FormData();
    
        // // **轉換 JSON 物件為 Blob**
        // const productData = { ...newProduct };
        // delete productData.productImages; // ✅ 確保 `productImages` 不進 JSON

        // const productBlob = new Blob([JSON.stringify(productData)], { type: "application/json" });
        // formData.append("productRequest", productBlob); // **與後端 @RequestPart("productRequest") 對應**
    
        // // **附加圖片**
        // if (newProduct.productImages && newProduct.productImages.length > 0) {
        //     newProduct.productImages.forEach((imageFile) => {
        //         if (imageFile instanceof File) {
        //             formData.append("productImages", imageFile); // ✅ 確保是 File
        //         } else {
        //             console.warn("⚠️ 無效的圖片格式，將忽略:", imageFile);
        //         }
        //     });
        // }

        // **發送請求**
        const response = await uploadFile("/products", newProduct);

        console.log("✅ 商品新增成功:", response.data);
        return response.data;

    } catch (error) {
        console.error("🔴 新增商品失敗:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
  },

  async updateProductImages(productId, images) {
    const formData = new FormData();

    // 附加圖片
    images.forEach((image) => {
        formData.append("images", image); // 確保 key 與後端 controller 一致
    });

    try {
        const response = await axiosapi.post(`/products/${productId}/images`, formData, {
            headers: {
                "Content-Type": "multipart/form-data", // ✅ 確保請求標頭正確
            },
        });

        console.log("✅ 圖片更新成功:", response.data);
        return response.data;
    } catch (error) {
        console.error("🔴 圖片更新失敗:", error);
        throw error;
    }
  },

  async modifyProducts(id, formData) {
    try {
        const response = await jsonRequest("put", `/products/${id}`, formData, 
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        console.log("✅ 後端 API 修改成功:", response);
        return response;
    } catch (error) {
        console.error("🔴 修改 API 失敗:", error);
        throw new Error("修改 API 失敗");
    }
  },
  
  async deleteProducts(id) {
    return jsonRequest("delete", `${API_URL}/${id}`);
  },

};