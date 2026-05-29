<template>
  <div class="counter">
    <img :alt="vueLogo" :src="logoPath" />
    <h2>{{ title }}</h2>
    <p>目前計數：{{ count }}</p>

    <button @click="decrease">- 減少</button>
    <button @click="increase">+ 增加</button>
    <button :disabled="isButtonDisabled">
      {{ isButtonDisabled ? '按鈕已被禁用' : '點我送出' }}
    </button>
  </div>
</template>

<script>
export default {
  name: "SimpleCounter",
  data() {
    return {
      vueLogo: "Vue logo",
      logoPath: require("../assets/logo.png"),
      title: "簡易計數器",
      count: 0,
      isButtonDisabled: true,

      products: [
        { id: 1, name: 'iPhone 15 Pro', price: 36000, isActive: true, quantity: 2 },
        { id: 2, name: 'iPad Air', price: 20000, isActive: true, quantity: 1.5 },
        { id: 3, name: 'Apple Watch (舊款)', price: 10000, isActive: false, quantity: 0.5 },
        { id: 4, name: 'MacBook Pro', price: 50000, isActive: true, quantity: 2.5 },
      ]
    };
  },
  methods: {
    increase() {
      this.count += 1;
    },
    decrease() {
      if (this.count > 0) {
        this.count -= 1;
      }
    },
  },
  mounted() {
    console.log('--- 🚀 Vue 2 陣列三劍客測試開始 ---');
    console.log('原始資料:', JSON.parse(JSON.stringify(this.products)));

    // ==========================================
    // 1. filter() 應用：只留下上架中 (isActive === true) 的商品
    // ==========================================
    const activeProducts = this.products.filter(item => item.isActive);
    
    console.log('\n===== 🔍 1. filter() 結果 =====');
    console.log('只留下上架商品（應該剩 3 項）:', activeProducts);


    // ==========================================
    // 2. map() 應用：將上架商品加工，算出「打 9 折」後的價格
    // ==========================================
    const discountProducts = activeProducts.map(item => {
      return {
        ...item,
        salePrice: item.price * 0.9 // 新增一個 salePrice 欄位
      };
    });

    console.log('\n===== 🗺️ 2. map() 結果 =====');
    console.log('加工後的新陣列（多出了 salePrice 欄位）:', discountProducts);
    console.log('驗證原始資料有沒有被污染（應該維持原價）:', this.products[0].price);


    // ==========================================
    // 3. forEach() 應用：純粹遍歷，直接修改 data 內的原始資料
    // ==========================================
    console.log('\n===== 🔄 3. forEach() 開始執行 =====');
    
    // 假設我們要大清倉，直接把 data 裡的每一項商品原價「通通減 1000 元」
    this.products.forEach(item => {
      item.price -= 1000; // 直接對每個物件進行修改
      console.log(`商品 [${item.name}] 的價格已被修改為: ${item.price}`);
    });

    console.log('\nforEach 執行完畢，檢查 Vue data 裡的原始資料（已被修改）:');
    console.log(this.products);

    const totalAmount = this.products.reduce((accumulator, item) => {
      // 每跑一圈，就把當前商品的 (價格 * 數量) 加上去
      return accumulator + (item.price * item.quantity);
    }, 0); // 0 accumulator 的「初始值」
    console.log('\ntotalAmount', totalAmount);
    
    console.log('\n--- 🏁 測試結束 ---');
  }
};
</script>

<!-- scoped 確保樣式只影響這個組件 -->
<style scoped>
.counter {
  text-align: center;
  margin-top: 50px;
}

button {
  margin: 0 10px;
  padding: 5px 10px;
}
</style>