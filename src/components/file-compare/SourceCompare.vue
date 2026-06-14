<template>
  <div class="page-container d-flex flex-column">
    
    <v-tabs v-model="activeTab" class="flex-shrink-0" background-color="primary" dark>
      <v-tab>檔案比對檢視</v-tab>
      <v-tab>其他分析資訊</v-tab>
    </v-tabs>

    <v-tabs-items v-model="activeTab" class="flex-grow-1">
      
      <v-tab-item class="fill-height">
        <div class="tab-content-wrapper">
          <FileDiffViewer />
        </div>
      </v-tab-item>

      <v-tab-item class="fill-height">
        <div class="tab-content-wrapper">
          <v-card class="pa-4">其他 Tab 的內容...</v-card>
        </div>
      </v-tab-item>

    </v-tabs-items>
  </div>
</template>

<script>
import FileDiffViewer from "./FileDiffViewer.vue";

export default {
  components: { FileDiffViewer },
  data() {
    return {
      activeTab: 0,
    };
  },
};
</script>

<style scoped>
.page-container {
  height: 100vh; /* 或是 calc(100vh - header_height) */
  width: 100%;
  overflow: hidden; /* 防止溢出導致出現兩個捲軸 */
}

/* 內容包裹層：確保內部元件能獲取正確高度 */
.tab-content-wrapper {
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 確保 Vuetify 的 tab-items 填滿 */
.v-tabs-items {
  height: 100%;
}
</style>