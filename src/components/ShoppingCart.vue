<template>
  <div class="shopping-cart">
    <h2>單品：{{ productName }}</h2>
    <p>單價：{{ price }} 元</p>
    
    <!-- 改變數量，會觸發 computed 重新計算 -->
    <label>數量：</label>
    <button @click="quantity--">-</button>
    <span> {{ quantity }} </span>
    <button @click="quantity++">+</button>

    <hr>

    <!-- 顯示 computed 計算出來的結果 -->
    <h3>【計算屬性 computed】</h3>
    <p>商品小計：{{ subTotal }} 元</p>
    <p>享用折扣後總金額（滿千折百）：<strong>{{ finalTotal }}</strong> 元</p>

    <hr>

    <!-- 顯示 watch 監聽到變化後，觸發的異動結果 -->
    <h3>【監聽器 watch 狀態】</h3>
    <p>系統訊息：{{ systemMessage }}</p>
    <p v-if="freeGift">🎁 恭喜獲得贈品：{{ freeGift }}</p>
  </div>
</template>

<script>
export default {
  // 1. data: 基礎資料
  data() {
    return {
      productName: '防潑水背包',
      price: 400,
      quantity: 1,
      systemMessage: '歡迎光臨！',
      freeGift: null
    };
  },

  // 2. computed: 適合「用既有資料組合、計算出新資料」，有快取機制
  computed: {
    // 只要 price 或 quantity 變動，subTotal 就會自動更新
    subTotal() {
      return this.price * this.quantity;
    },
    // 滿 1000 現折 100
    finalTotal() {
      if (this.subTotal >= 1000) {
        return this.subTotal - 100;
      }
      return this.subTotal;
    }
  },

  // 3. watch: 適合「當資料改變時，去做某件特定的事」（例如：打 API、彈跳視窗、計時器）
  watch: {
    // 監聽 finalTotal 這個金額的變化
    finalTotal(newVal, oldVal) {
      this.systemMessage = `總金額已從 ${oldVal} 元變更為 ${newVal} 元`;

      // 當金額滿 2000 元，觸發非同步行為（模擬打 API 獲取贈品）
      if (newVal >= 2000 && !this.freeGift) {
        this.fetchFreeGiftFromServer();
      } else if (newVal < 2000) {
        this.freeGift = null; // 金額不夠就收回贈品
      }
    }
  },

  // 額外定義的方法
  methods: {
    // 模擬發送 API 請求
    fetchFreeGiftFromServer() {
      this.systemMessage = '正在為您查詢滿額贈品...';
      
      // 模擬網路延遲 1 秒
      setTimeout(() => {
        this.freeGift = '質感金屬保溫杯';
        this.systemMessage = '贈品已成功加入您的購物車！';
      }, 1000);
    }
  }
};
</script>