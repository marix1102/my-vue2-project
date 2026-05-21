import request from '@/utils/request'

// 導出一個獲取產品列表的函式
export function getProductList() {
  return request({
    url: '/api/products', // 會自動接在 baseURL 後面
    method: 'get'
  })
}

// 導出一個新增產品的函式 (POST 範例)
export function createProduct(data) {
  return request({
    url: '/api/products',
    method: 'post',
    data // 傳送給後端的 Body 資料
  })
}