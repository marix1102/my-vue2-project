<template>
  <v-container>
    <!-- v-card 讓表單有個好看的外框與陰影 -->
    <v-card class="mx-auto mt-5" max-width="500">
      <v-card-title class="headline blue white--text">
        基本資料表單
      </v-card-title>

      <v-card-text class="pt-4">
        <!-- ref="form" 是為了在 JS 中操作表單狀態（如重設、觸發驗證） -->
        <!-- v-model="valid" 會即時反映整個表單是否驗證通過（true/false） -->
        <v-form ref="form" v-model="valid" lazy-validation>
          <!-- 1. 姓名輸入框 (必填) -->
          <v-text-field
            v-model="formData.name"
            :rules="nameRules"
            label="姓名"
            required
            outlined
            dense
          ></v-text-field
          ><!-- outlined外框線 + dense緊湊高度 -->

          <!-- 2. 信箱輸入框 (必填 + 格式驗證) -->
          <v-text-field
            v-model="formData.email"
            :rules="emailRules"
            label="電子信箱"
            required
            outlined
            dense
          ></v-text-field>

          <!-- 3. 下拉選單 (必填) -->
          <v-select
            v-model="formData.role"
            :items="roles"
            :rules="[(v) => !!v || '請選擇一個角色']"
            label="專長角色"
            outlined
            dense
          ></v-select>

          <v-text-field
            v-model="formattedPrice"
            label="金額"
            outlined
            dense
            @focus="isFocused = true"
            @blur="isFocused = false"
            @keypress="onlyNumber"
          ></v-text-field>

          <!-- 4. 勾選框 (必須勾選) -->
          <v-checkbox
            v-model="formData.agree"
            :rules="[(v) => !!v || '您必須同意條款才能繼續']"
            label="我已閱讀並同意服務條款"
            required
          ></v-checkbox>

          <!-- 按鈕區塊 -->
          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="submitForm"
          >
            送出資料
          </v-btn>

          <v-btn color="error" @click="resetForm"> 清除表單 </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    <!-- <div class="amber lighten-4 orange--text text--darken-4 pa-3 mb-3">
      淺黃色背景 + 深橘色文字（標準的警告/注意提示配色）
    </div>

    <div class="d-flex justify-center">
      <v-btn class="mr-2">確定</v-btn>
      <v-btn>取消</v-btn>
    </div>

    <div class="d-flex justify-space-between align-center grey lighten-4 pa-3">
      <h3>商品管理後台</h3>
      <v-btn color="primary">新增商品</v-btn>
    </div> -->
  </v-container>
</template>

<script>
export default {
  name: "BasicForm",
  data() {
    return {
      // 表單整體的驗證狀態
      valid: true,
      isFocused: false,
      // 表單資料綁定
      formData: {
        name: "",
        email: "",
        rawPrice: 0,
        role: null,
        agree: false,
      },
      // 驗證規則 (Rules)：本質上是一個回傳布林值或字串的函式陣列
      nameRules: [
        (v) => !!v || "姓名為必填欄位",
        (v) => (v && v.length <= 10) || "姓名不能超過 10 個字元",
      ],
      emailRules: [
        (v) => !!v || "E-mail 為必填欄位",
        (v) => /.+@.+\..+/.test(v) || "請輸入有效的 E-mail 格式",
      ],
      // 下拉選單的選項
      roles: ["前端工程師", "後端工程師", "全端工程師", "UI/UX 設計師"],
    };
  },
  methods: {
    submitForm() {
      // 雙重保險：手動觸發整張表單的驗證
      if (this.$refs.form.validate()) {
        // 驗證通過，這裡可以執行 API 發送
        alert("表單驗證成功！準備送出資料：" + JSON.stringify(this.formData));
      } else {
        alert("表單驗證失敗，請檢查欄位！");
      }
    },
    resetForm() {
      // 清空表單欄位的值，並且重置驗證的錯誤紅字
      this.$refs.form.reset();
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
          return this.formData.rawPrice === 0
            ? ""
            : this.formData.rawPrice.toString();
        }
        // 如果使用者離開輸入框，將數字加上千分位後顯示
        return this.formData.rawPrice
          ? Number(this.formData.rawPrice).toLocaleString("en-US")
          : "";
      },
      set(val) {
        // 當使用者輸入時，把千分位的逗號過濾掉，存回純數字
        // replace(/[^\d]/g, '') 可以確保只留下數字，自動過濾掉英文和符號
        const cleanNumber = val.replace(/[^\d]/g, "");
        this.formData.rawPrice = cleanNumber ? parseInt(cleanNumber, 10) : 0;
      },
    },
  },
};
</script>