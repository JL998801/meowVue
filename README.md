# vue-project

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

#前端架構

src/

├── assets/                靜態資源（如圖片、字體、樣式）

├── components/            可重複使用的 Vue 元件（如按鈕、表單）

├── views/                 頁面級元件（如首頁、產品詳情頁）

├── router/                路由配置檔案

│   └── index.js           集中管理所有路由

├── store/                 Pinia 狀態管理模組

│   └── productStore.js    範例：商品相關狀態

├── services/              API 請求模組（使用 Axios）

│   └── productService.js  範例：商品相關 API

├── plugins/               第三方插件配置（如 SweetAlert2）

├── styles/                全域樣式檔案（可整合 Bootstrap 或自訂樣式）

├── App.vue                應用的根元件

└── main.js                入口文件

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
