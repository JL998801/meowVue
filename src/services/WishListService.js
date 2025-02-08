import axios from "axios";

const API_BASE_URL = "/wishlists";

export const WishListService = {
// ✅ 新增商品到願望清單
async addToWishList(productId, memberId) {
try {
    const response = await fetch(`${API_BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberId, productId })
    });
    return await response.json();
} catch (error) {
    console.error("加入願望清單失敗:", error);
    return null;
}
},

// ✅ 從願望清單移除商品
async removeFromWishList(productId, memberId) {
try {
    const response = await fetch(`${API_BASE_URL}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberId, productId })
    });
    return await response.json();
} catch (error) {
    console.error("從願望清單移除商品失敗:", error);
    return null;
}
},

// ✅ 查詢會員的願望清單
async getWishList(memberId) {
try {
    const response = await fetch(`${API_BASE_URL}?memberId=${memberId}`);
    return await response.json();
} catch (error) {
    console.error("獲取願望清單失敗:", error);
    return null;
}
}
};
