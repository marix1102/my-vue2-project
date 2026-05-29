<template>
  <v-container class="text-center">
    <v-btn color="primary" dark @click="dialog = true">
      開啟新增資料視窗
    </v-btn>

    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="headline grey lighten-2">
          新增會員資料
        </v-card-title>

        <v-card-text class="pt-4">
          <v-form ref="form" lazy-validation>
            <v-text-field
              v-model="username"
              label="使用者名稱"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="phone"
              label="聯絡電話"
              outlined
              dense
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer> <v-btn color="grey lighten-1" text @click="closeDialog">
            取消
          </v-btn>
          
          <v-btn color="success" @click="saveData">
            確認儲存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 畫面上方的成功提示條 -->
    <v-snackbar v-model="toast" color="success" timeout="2000" top>
      資料已儲存！姓名：{{username}}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: "SimpleDialog",
  data() {
    return {
      // 控制視窗開關的開關（false 代表預設隱藏）
      dialog: false,
      toast: false,
      // 表單資料
      username: "",
      phone: "",
    };
  },
  methods: {
    closeDialog() {
      this.dialog = false;
      this.username = "";
      this.phone = "";
    },
    saveData() {
      // alert(`資料已儲存！姓名：${this.username}`);
      this.toast = true; // 跳出成功提示
      // this.closeDialog();
    },
  },
};
</script>