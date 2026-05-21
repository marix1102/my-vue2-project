<template>
  <v-container>
    <div style="max-width: 200px">
      <v-text-field
        v-model.number="quantity"
        type="number"
        label="購買數量"
        step="1"
        outlined
        dense
      ></v-text-field>

      <!-- 客製化 加減按鈕 -->
      <!-- <v-text-field
        v-model.number="quantity"
        label="商品數量"
        outlined
        dense
        readonly
        hide-details
        class="text-center-input"
      >
        <template v-slot:prepend>
          <v-btn icon small color="error" @click="minus">
            <v-icon>mdi-minus-circle</v-icon>
          </v-btn>
        </template>

        <template v-slot:append-outer>
          <v-btn icon small color="success" @click="plus">
            <v-icon>mdi-plus-circle</v-icon>
          </v-btn>
        </template>
      </v-text-field> -->

      <v-text-field
        v-model="formattedPrice"
        label="金額"
        outlined
        dense
        @focus="isFocused = true"
        @blur="isFocused = false"
        @keypress="onlyNumber"
      ></v-text-field>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "SimpleTextField",
  data() {
    return {
      quantity: 1, // 預設數量為 1

      isFocused: false,
      rawPrice: 0,
    };
  },
  methods: {
    plus() {
      // 點擊加號，數量 +1 (可以自己設定上限，例如最多選 10)
      if (this.quantity < 10) {
        this.quantity++;
      }
    },
    minus() {
      // 點擊減號，數量 -1 (限制最低為 1)
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    onlyNumber(event) {
      // 1. 抓取使用者按下的字元碼
      const keyCode = event.keyCode ? event.keyCode : event.which;

      // 2. 數字 0-9 的 keyCode 範圍是 48 到 57
      // 如果按下的鍵不在這個範圍內，就執行 event.preventDefault() 沒收這個點擊
      if (keyCode < 48 || keyCode > 57) {
        event.preventDefault();
      }
    },
  },
  computed: {
    formattedPrice: {
      get() {
        // 如果使用者正在打字，顯示純數字讓他們好輸入
        if (this.isFocused) {
          return this.rawPrice === 0
            ? ""
            : this.rawPrice.toString();
        }
        // 如果使用者離開輸入框，將數字加上千分位後顯示
        return this.rawPrice
          ? Number(this.rawPrice).toLocaleString("en-US")
          : "";
      },
      set(val) {
        // 當使用者輸入時，把千分位的逗號過濾掉，存回純數字
        // replace(/[^\d]/g, '') 可以確保只留下數字，自動過濾掉英文和符號
        const cleanNumber = val.replace(/[^\d]/g, "");
        this.rawPrice = cleanNumber ? parseInt(cleanNumber, 10) : 0;
      },
    },
  },
};
</script>

<style scoped>
/* 額外小技巧：讓輸入框裡面的文字居中對齊，看起來更像電商計數器 */
::v-deep .v-text-field input {
  text-align: center;
}
</style>