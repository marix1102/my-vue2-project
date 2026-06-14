<template>
  <div class="custom-layout-wrapper">
    
    <!-- 1. 最上面放選單的一排空間（從左邊開始排 3 個） -->
    <div class="top-menu-bar d-flex align-center pa-2">
      
      <!-- 選單一 -->
      <v-menu offset-y>
        <!-- 💡 在 .vue 檔案中，推薦使用現代的 v-slot:activator 語法 -->
        <template v-slot:activator="{ on, attrs }">
          <v-btn text small color="grey darken-3" v-bind="attrs" v-on="on" class="mr-2">
            檔案選單 <v-icon right small>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item @click="handleMenuClick('檔案選單', '載入地圖')">
            <v-list-item-title>載入地圖</v-list-item-title>
          </v-list-item>
          <v-list-item @click="handleMenuClick('檔案選單', '匯出資料')">
            <v-list-item-title>匯出資料</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- 選單二 -->
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text small color="grey darken-3" v-bind="attrs" v-on="on" class="mr-2">
            分析工具 <v-icon right small>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item @click="handleMenuClick('分析工具', '重疊比對')">
            <v-list-item-title>重疊比對</v-list-item-title>
          </v-list-item>
          <v-list-item @click="handleMenuClick('分析工具', '差異標明')">
            <v-list-item-title>差異標明</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- 選單三 -->
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text small color="grey darken-3" v-bind="attrs" v-on="on">
            檢視設定 <v-icon right small>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item @click="handleMenuClick('檢視設定', '顯示網格')">
            <v-list-item-title>顯示網格</v-list-item-title>
          </v-list-item>
          <v-list-item @click="handleMenuClick('檢視設定', '隱藏背景')">
            <v-list-item-title>隱藏背景</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- 右側輔助顯示：呈現父組件傳過來的參數 -->
      <v-spacer></v-spacer>
      <span class="caption grey--text text--darken-1 mr-2">
        廠區: {{ storeName }}
      </span>
    </div>

    <!-- 2. 中間放一排 Tabs 的空間（從左邊開始放 2 個） -->
    <v-tabs v-model="activeTab" background-color="white" color="teal darken-3" dense>
      <v-tab>📊 數據統計面版</v-tab>
      <v-tab>🗺️ 地圖可視化區域</v-tab>
    </v-tabs>
    
    <v-divider></v-divider>

    <!-- 3. 剩下的區塊就是 Tab 內容顯示的區塊了 -->
    <v-tabs-items v-model="activeTab" class="content-area pa-4">
      
      <!-- Tab 1 的內容 -->
      <v-tab-item>
        <v-card flat color="transparent">
          <v-card-text class="pa-0">
            <div class="text-subtitle-1 font-weight-bold mb-2">這是 [分頁一] 的內容顯示區塊</div>
            <p class="grey--text text--darken-1">這裡可以用來放置報表、圖表、或是資料矩陣。</p>
            <v-alert dense outlined type="info" class="mt-4">
              {{ currentAction }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-tab-item>

      <!-- Tab 2 的內容 -->
      <v-tab-item>
        <v-card flat color="transparent">
          <v-card-text class="pa-0">
            <div class="text-subtitle-1 font-weight-bold mb-2">這是 [分頁二] 的內容顯示區塊</div>
            <p class="grey--text text--darken-1">這裡可以用來放置畫布（Canvas）、地圖模型或者是主對比視窗。</p>
            <div class="caption mt-4 blue-grey--text">
              接收到的地圖參數物件長度：{{ Object.keys(viewD005Map).length }}
            </div>
          </v-card-text>
        </v-card>
      </v-tab-item>
      
    </v-tabs-items>

  </div>
</template>

<script>
export default {
  // 💡 組件名稱（大駝峰）
  name: "FileCompare",
  
  // 💡 宣告接收父類別傳進來的參數
  props: {
    storeName: {
      type: String,
      default: "未命名廠區"
    },
    viewD005Map: {
      type: Object,
      default: () => ({})
    }
  },
  
  data() {
    return {
      activeTab: 0,
      currentAction: "尚未選擇任何選單項目"
    };
  },
  
  methods: {
    handleMenuClick(menuName, optionName) {
      this.currentAction = `您點選了：${menuName} 的 [${optionName}]`;
      console.log(menuName, optionName);
    }
  }
};
</script>

<!-- 💡 scoped 代表此 CSS 樣式只會套用在這個組件內部，絕對不污染外部其他頁面 -->
<style scoped>
.custom-layout-wrapper {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}
.top-menu-bar {
  border-bottom: 1px solid #eeeeee;
  background-color: #f5f5f5;
}
.content-area {
  min-height: 200px;
  background-color: #fafafa;
}
</style>