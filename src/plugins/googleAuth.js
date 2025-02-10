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

        loadGAPI()
            .then(() => {
                console.log('gapi 已加載，開始加載 google.accounts.id...');

                const timeoutId = setTimeout(() => {
                    console.error('Google API 加載超時');
                    reject('Google API 加載超時');
                }, timeout);

                // 使用新版的 Google Identity Services 進行初始化
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponse,  // 用來處理登入回應的 callback 函數
                });

                isGapiLoaded = true;
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
    console.log('登入成功，ID Token:', response.credential);

    // 在這裡你可以進行後端驗證 ID Token，並獲取用戶資料
    // 例如：發送到後端進行驗證
}

// 載入 gapi 的函數，確保它只加載一次
function loadGAPI() {
    return new Promise((resolve, reject) => {
        if (typeof window.google !== "undefined" && window.google.accounts) {
            console.log('gapi 已加載');
            resolve(window.google.accounts);
        } else {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.onload = () => {
                console.log('gapi 載入成功');
                resolve(window.google.accounts);
            };
            script.onerror = (error) => {
                console.error('gapi 載入失敗:', error);
                reject(new Error('gapi 載入錯誤'));
            };
            document.body.appendChild(script);
        }
    });
}

// 渲染 Google 登入按鈕
export const renderGoogleSigninButton = (clientId) => {
    window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),  // 按鈕的 DOM 元素
        {
            theme: "outline",
            size: "large",
            text: "signin_with",  // 設定按鈕顯示文字
            shape: "pill",
        }
    );
};
