<template>
  <!-- <div style="border: 2px solid #35495e; padding: 20px;"> -->
  <v-container class="pa-4">
    <h2>父組件：【內場廚房】</h2>
    <p class="text-body-1 mb-4">
      最新廣播：<span class="font-weight-medium error--text">{{
        broadcastMessage
      }}</span>
    </p>

    <!-- 測試按鈕：動態改變父組件狀態，Props 會自動同步給子組件 -->
    <v-btn color="secondary" outlined class="mb-4" @click="isOpen = !isOpen">
      切換營業狀態
    </v-btn>
    <v-divider class="my-4"></v-divider>

    <!-- 
      同時展現：
      1. 父傳子 (Props) -> :storeName 和 :isOpening
      2. 子傳父 ($emit)  -> @new-order
    -->
    <OrderCounter
      :storeName="myStoreName"
      :isOpening="isOpen"
      :view-d005-map="viewD005Map"
      @new-order="handleOrder"
    />
    <!-- </div> -->
  </v-container>
</template>

<script>
import OrderCounter from "@/components/Order/OrderCounter.vue";

export default {
  components: { OrderCounter },
  data() {
    return {
      myStoreName: "咖啡廳", // 要傳給子組件的店名
      isOpen: true, // 要傳給子組件的營業狀態
      broadcastMessage: "目前沒有新訂單",
      viewD005Map:{"test":"test123"}
    };
  },
  methods: {
    handleOrder(payload, takeOut) {
      // 接收子組件傳回的多個參數
      const diningType = takeOut ? "外帶" : "內用";
      this.broadcastMessage = `收到訂單：${payload.itemName} ${payload.quantity}杯 (${payload.note})-【${diningType}】`;
    },
  },
};
</script>