let isGapiLoaded = false; // 檢查 gapi 是否已經加載過
let authInstance = null;  // 保存 auth2 實例

// 這個函數會返回一個 Promise，確保 gapi 加載成功後初始化 Google 登入
export const loadGoogleAuth = (clientId, timeout = 5000) => {
    return new Promise((resolve, reject) => {
        console.log('開始檢查 gapi 是否已加載...');

        // 如果 gapi 已經加載過，直接使用現有的 authInstance
        if (isGapiLoaded && authInstance) {
            console.log('gapi 已加載，使用現有的 authInstance');
            return resolve(authInstance);
        }

        console.log('gapi 尚未加載，開始加載 gapi...');

        loadGAPI()
            .then(() => {
                console.log('gapi 已加載，開始加載 google.accounts.id...');

                const timeoutId = setTimeout(() => {
                    console.error('Google API 加載超時');
                    reject('Google API 加載超時');
                }, timeout);

                console.log('初始化 Google Identity Services...');

                // 使用新版的 Google Identity Services 進行初始化
                // 使用新版的 Google Identity Services 進行初始化
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: (response) => {
                        console.log("google登入回應", response);  // 在這裡確認是否能接收到 response
                        googleLoginSuccess(response);  // 呼叫你的登入回調函數
                    },
                });

                console.log('設定 Google API timeout...');
                isGapiLoaded = true;

                // 清除超時計時器
                clearTimeout(timeoutId);
                console.log('Google API 初始化成功，google.accounts.id 已加載');

                resolve(window.google.accounts.id); // 返回 gsi 的 api
            })
            .catch((error) => {
                console.error('gapi 載入錯誤:', error);
                reject('gapi 載入錯誤: ' + error.message);
            });
    });
};


// 處理用戶登入回應的 callback 函數
function handleCredentialResponse(response) {
    // `response.credential` 會包含 ID Token
    console.log('登入成功，google response:', response);
    console.log('登入成功，ID Token:', response.credential);

    // 在這裡你可以進行後端驗證 ID Token，並獲取用戶資料
    // 例如：發送到後端進行驗證
}

// 載入 gapi 的函數，確保它只加載一次
function loadGAPI() {
    return new Promise((resolve, reject) => {
        console.log('開始檢查 gapi 是否已加載...');

        if (typeof window.google !== "undefined" && window.google.accounts) {
            console.log('gapi 已加載');
            resolve(window.google.accounts);
        } else {
            console.log('gapi 尚未加載，開始加載 gapi...');

            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            console.log('正在載入 gapi 腳本:', script.src);

            script.onload = () => {
                console.log('gapi 載入成功');
                resolve(window.google.accounts);
            };

            script.onerror = (error) => {
                console.error('gapi 載入失敗:', error);
                reject(new Error('gapi 載入錯誤'));
            };

            console.log('將 gapi 載入腳本加到文件中...');
            document.body.appendChild(script);
        }
    });
}

// 渲染 Google 登入按鈕
export const renderGoogleSigninButton = (clientId) => {
    try {
        console.log('開始渲染 Google 登入按鈕...');
        window.google.accounts.id.renderButton(
            document.getElementById("google-signin-button"),  // 按鈕的 DOM 元素
            {
                theme: "outline",
                size: "large",
                text: "signin_with",  // 設定按鈕顯示文字
                shape: "pill",
            }
        );
        console.log('Google 登入按鈕渲染成功');
    } catch (error) {
        console.error('渲染 Google 登入按鈕失敗:', error);
    }
};
