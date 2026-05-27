<template>
      <v-container class="py-8" style="max-width: 600px;">
        
        <v-card class="mx-auto" elevation="4" rounded="lg">
          
          <v-card-title class="headline primary white--text d-flex justify-space-between align-center">
            <span class="font-weight-bold">Keep Alive</span>
            <!-- <v-chip color="secondary" small>Vue 2 / Vuetify</v-chip> -->
          </v-card-title>

          <v-card-text class="pt-4">
            <div class="subtitle-1 font-weight-medium mb-1">
              動態組件 與 &lt;keep-alive&gt; 快取
            </div>
            <p class="body-2 grey--text text--darken-1">
              切換下方標籤頁來觀測組件行為。開啟快取時，分頁 A 輸入的內容在切換後將會被完整保留。
            </p>

            <v-switch
              v-model="useKeepAlive"
              label="啟用 <keep-alive> 快取功能"
              color="success"
              inset
              hide-details
              class="mt-0 mb-4"
            ></v-switch>

            <v-tabs v-model="activeTabKey" background-color="transparent" color="primary" grow>
              <v-tab v-for="tab in tabsConfig" :key="tab.key">
                <v-icon left small>{{ tab.icon }}</v-icon>
                {{ tab.label }}
              </v-tab>
            </v-tabs>
            
            <v-divider class="mb-4"></v-divider>

            <v-sheet class="pa-4 grey lighten-5" rounded="md" outlined min-height="150">
              <div class="caption grey--text mb-2">當前渲染組件：{{ currentTabComponent }}</div>

              <keep-alive>
                <component :is="currentTabComponent"></component>
              </keep-alive> 

              <!-- <keep-alive v-if="useKeepAlive">
                <component :is="currentTabComponent"></component>
              </keep-alive> 

              <component v-else :is="currentTabComponent"></component> -->
            </v-sheet>

          </v-card-text>
        </v-card>

      </v-container>
</template>

<script>
// 引入先前建立的兩個簡單子組件
import TabInput from '@/components/keep-alive/TabInput.vue';
import TabInfo from '@/components/keep-alive/TabInfo.vue';

export default {
  name: 'App',
  components: {
    TabInput,
    TabInfo
  },
  data() {
    return {
      activeTabKey: 0,       // Vuetify 標籤頁的索引 (0, 1, 2...)
      useKeepAlive: true,    // 是否開啟快取開關
      
      // 標籤頁的設定檔
      tabsConfig: [
        { key: 0, label: '分頁 A：基本資料', component: 'TabInput', icon: 'mdi-account-box' },
        { key: 1, label: '分頁 B：系統說明', component: 'TabInfo', icon: 'mdi-information' }
      ]
    };
  },
  computed: {
    // 根據目前被選中的標籤頁索引，動態計算出對應的組件名稱
    currentTabComponent() {
      const activeTab = this.tabsConfig.find(tab => tab.key === this.activeTabKey);
      return activeTab ? activeTab.component : 'TabInput';
    }
  }
};
</script>

<style>
/* 稍微美化一下原生輸入框，使其外觀更貼近 Vuetify 風格 */
input[type="text"] {
  border: 1px solid #ccc;
  padding: 6px 12px;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s;
}
input[type="text"]:focus {
  border-color: #1976d2;
}
</style>