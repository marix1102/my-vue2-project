<template>
  <v-sheet outlined rounded="lg" class="pa-4 grey lighten-5">
    <!-- 1. 使用從父組件傳過來的 Props -->
    <div class="text-h6 font-weight-bold success--text mb-2">
      子組件：【{{ storeName }} - 點餐櫃檯】
    </div>
    <p class="text-body-1">
      目前營業狀態：
      <span :class="isOpening ? 'success--text' : 'error--text'" class="font-weight-bold">
        {{ isOpening ? "營業中" : "已打烊" }}
      </span>
    </p>

    <div class="mb-4">
      <v-switch
        v-model="isTakeOut"
        :label="`目前選擇：${isTakeOut ? '外帶' : '內用'}`"
        color="success"
        hide-details
      ></v-switch>
    </div>

    <!-- 如果打烊了，就禁用點餐按鈕 -->
    <v-btn
      color="primary"
      block
      large
      :disabled="!isOpening"
      @click="submitOrder"
    >
      <v-icon left>mdi-silverware-clean</v-icon>
      送出訂單
    </v-btn>
  </v-sheet>
</template>

<script>
export default {
  // 宣告接收父組件傳下來的資料
  props: {
    storeName: {
      type: String,
      default: "飲料店",
    },
    isOpening: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isTakeOut: true, //紀錄內用或外帶狀態（預設為外帶）
    };
  },
  methods: {
    submitOrder() {
      const orderDetails = {
        itemName: "熱美式咖啡",
        quantity: 1,
        note: "不加糖",
      };
      this.$emit("new-order", orderDetails, this.isTakeOut);
      this.$myAlert('已送出訂單！');
    },
  },
};
</script>