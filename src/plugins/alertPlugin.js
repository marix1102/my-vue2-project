const AlertPlugin = {
  // Vue 插件必須實作 install
  install(Vue) {
    // 在 Vue 的原型鏈上掛載全域方法
    Vue.prototype.$myAlert = function (message) {
      alert(`【系統通知】\n${message}`);
    };
  }
};

export default AlertPlugin;