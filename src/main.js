import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import VueVirtualScroller from 'vue-virtual-scroller';

import AlertPlugin from './plugins/alertPlugin';
import DirectivesPlugin from './directives';

Vue.config.productionTip = false


Vue.use(VueVirtualScroller);

Vue.use(AlertPlugin);
Vue.use(DirectivesPlugin);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
