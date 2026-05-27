export const demoMixin = {
  data() {
    return {
      title: "我是 Mixin 的標題",     // 衝突點 A：與組件同名
      mixinOnly: "我是 Mixin 獨有的變數"
    };
  },
  created() {
    // 衝突點 B：生命週期鉤子
    console.log("【生命週期】1. Mixin 的 created 被觸發了！");
  },
  methods: {
    // 衝突點 C：與組件同名的方法
    showMessage() {
      console.log("這是 Mixin 的 showMessage 方法");
    },
    mixinMethod() {
      console.log("這是 Mixin 獨有的方法");
    }
  }
};