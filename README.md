# vue-project

This template should help get you started developing with Vue 3 in Vite.

# Logo 來源

https://zh.pngtree.com/freepng/dog-cat-pet-shovel-officer_3934436.html

![image](https://github.com/user-attachments/assets/6d951407-7004-4d97-9814-f6a3fc1f33fa)

![螢幕擷取畫面 2025-01-17 162848](https://github.com/user-attachments/assets/728fadca-4016-40dd-8e07-40cc90cabd78)

![petLogo](https://github.com/user-attachments/assets/b1726e3f-2039-4f9a-bd1c-3a64b48b8d3c)
<a href='https://zh.pngtree.com/freepng/dog-cat-pet-shovel-officer_3934436.html'>png 圖片來源於 zh.pngtree.com/</a>

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

#前端架構範例

src/

├── assets/ 靜態資源（如圖片、字體、樣式）

├── components/ 可重複使用的 Vue 元件（如按鈕、表單）

├── views/ 頁面級元件（如首頁、產品詳情頁）

│ └── pets 集中管理所有寵物相關頁面

│ └── shops 集中管理所有商城相關頁面

│ └── secure 集中管理所有登入相關頁面

├── router/ 路由配置檔案

│ └── routers.js 集中管理所有路由

├── store/ Pinia 狀態管理模組

│ └── productStore.js 範例：商品相關狀態

├── services/ API 請求模組（使用 Axios）

│ └── productService.js 範例：商品相關 API

├── plugins/ 第三方插件配置（如 SweetAlert2）

├── styles/ 全域樣式檔案（可整合 Bootstrap 或自訂樣式）

├── App.vue 應用的根元件

└── main.js 入口文件

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```
