import axios from 'axios'

// 建立 axios 實例
const service = axios.create({
  baseURL: 'http://localhost:8081/', // 後端 API 的基礎網址
  timeout: 5000                       // 請求逾時時間（5秒）
})

// 請求攔截器 (Request Interceptor)
service.interceptors.request.use(
  config => {
    // 在發送請求之前可以做些什麼？
    // 範例：如果本地儲存有 Token，就自動幫每個請求加上 Authorization 標頭
    const token = localStorage.getItem('user_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    // 處理請求錯誤
    console.error('請求發送失敗：', error)
    return Promise.reject(error)
  }
)

// 回應攔截器 (Response Interceptor)
service.interceptors.response.use(
  response => {
    // 狀態碼為 2xx 時觸發。
    // 這裡可以直接過濾出後端回傳的 data 內容，簡化組件端的程式碼
    return response.data
  },
  error => {
    // 狀態碼超出 2xx 範圍時觸發（如 401, 403, 404, 500）
    // 可以在這裡做全域的錯誤提示
    if (error.response) {
      switch (error.response.status) {
        case 401:
          alert('登入逾時或未授權，請重新登入')
          // 這裡通常會做跳轉到登入頁的處理
          break
        case 404:
          alert('找不到請求的資源 (404)')
          break
        case 500:
          alert('伺服器內部錯誤 (500)')
          break
        default:
          alert('網路異常，請稍後再試')
      }
    }
    return Promise.reject(error)
  }
)

export default service