<template>
  <div style="padding: 20px; font-family: sans-serif; line-height: 1.8">
    <h2>Vue Mixin 合併策略實測</h2>
    <hr />

    <h3>1. Data 屬性合併結果：</h3>
    <p><strong>title:</strong> {{ title }}</p>
    <p><strong>mixinOnly:</strong> {{ mixinOnly }}</p>

    <hr />

    <h3>2. Methods 觸發實測：</h3>
    <v-btn @click="showMessage">執行 showMessage()</v-btn>
    <v-btn @click="mixinMethod">執行 mixinMethod()</v-btn>
  </div>
</template>

<script>
import { demoMixin } from "@/mixins/demoMixin";

export default {
  name: "App",
  mixins: [demoMixin], // 引入

  data() {
    return {
      // 這裡與 Mixin 衝突了！組件自身優先
      title: "我是組件內部的標題",
    };
  },

  created() {
    // 這裡與 Mixin 衝突了！但生命週期的規則是：兩者都會執行
    console.log("【生命週期】2. 組件自身的 created 被觸發了！");
  },

  methods: {
    // 這裡與 Mixin 衝突了！組件自身優先
    showMessage() {
      console.log("這是組件自身的 showMessage 方法");
    },
  },
};
</script>