# 1. 使用 Node.js 來建構前端
FROM node:18 AS build
WORKDIR /app                
COPY package.json package-lock.json ./      
RUN npm install
COPY . .             
RUN npm run build              
CMD ["sh"]

# 事先 COPY package*.json ./ 讓 npm install 只在 package.json 變更時才重新執行，不會每次都重新下載函式庫
 # Docker 會在該暫時性 Build 容器內創建 /app 目錄，往後指令都在此目錄執行
 # copy.. 將Jenkins 內的 ./frontend/vue-project 目錄複製到 /app
# RUN npm run build  執行 npm install 和 npm run build，產生 /app/dist/

# 2. 使用 Nginx 作為前端伺服器
FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html    
COPY default.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /etc/nginx/certs
VOLUME ["/etc/nginx/certs"]
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]

# COPY nginx.conf /etc/nginx/nginx.conf  設定 Nginx 配置檔
# mkdir -p /etc/nginx/certs 建立目錄來存放 SSL 憑證，並設定掛載點 (這樣在 VM 部署時可以掛載 SSL 憑證)
# COPY --from=build /  build表第一建構階段產出，最終 /app/dist/ 會被複製到 Nginx 容器的 /usr/share/nginx/html
# docker build 完成後，暫時性建構容器 自動銷毀，只有 leekuanju/frontend:latest 映像檔會被保存
