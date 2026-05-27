import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import AlertPlugin from './plugins/alertPlugin';

Vue.config.productionTip = false

// 註冊全域插件
Vue.use(AlertPlugin);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
