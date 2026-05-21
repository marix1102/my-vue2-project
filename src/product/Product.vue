<template>
  <div class="product-container">
    <h2>產品列表（獨立封裝版）</h2>
    
    <div v-if="loading">資料載入中...</div>

    <ul v-else>
      <li v-for="product in products" :key="product.id">
        商品：{{ product.name }} | 價格：${{ product.price }}
      </li>
    </ul>
  </div>
</template>

<script>
// 1. 引入統一管理的 API 函式
import { getProductList } from '@/api/product'

export default {
  name: 'ProductList',
  data() {
    return {
      products: [],
      loading: false
    }
  },
  created() {
    // 2. 在生命週期中呼叫
    this.fetchData()
  },
  methods: {
    // 使用 async / await 語法糖優化 Promise 寫法
    async fetchData() {
      this.loading = true
      try {
        // 3. 直接呼叫 API 函式
        // 因為回應攔截器已經處理過，這裡拿到的 res 直接就是後端回傳的資料物件
        const res = await getProductList()
        this.products = res
        console.log('res ',res)
      } catch (error) {
        // 全域錯誤已在攔截器處理（跳出 alert），這裡可選擇做組件內特有的防錯或僅做 log
        console.error('組件內捕捉到錯誤：', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>