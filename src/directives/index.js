import lazy from './lazy';
import badge from './badge';

// 將所有指令收集到一個物件中
const directives = {
  lazy,
  badge
};

// 匯出 Vue 插件物件
export default {
  install(Vue) {
    // 遍歷物件，自動執行 Vue.directive('lazy', lazy) ... 等
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key]);
    });
  }
};