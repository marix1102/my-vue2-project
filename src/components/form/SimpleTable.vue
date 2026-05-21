<template>
  <v-container>
    <v-alert type="info" dense outlined class="mb-3">
      請選擇想比較的甜點（**最多只能選擇 3 筆**）。目前已選：{{
        selectedItems.length
      }}
      筆
    </v-alert>

    <v-card class="mb-3 pa-3" outlined dense>
      <strong>目前選取的甜點：</strong>
      {{ selectedItems.map((item) => item.name).join(", ") || "尚未選取" }}
    </v-card>

    <!-- class="elevation-1" 是 Vuetify 內建的陰影效果，讓表格微微浮起更好看 -->
    <!-- single-select 單選時 -->
    <v-data-table
      show-select
      v-model="selectedItems"
      item-key="name"
      :headers="headers"
      :items="desserts"
      :items-per-page="5"
      :footer-props="{
        'items-per-page-options': [5, 10, 20, { text: '全部', value: -1 }],
        'items-per-page-text': '每頁筆數：',
      }"
      class="elevation-1"
      dense
    >
      <template v-slot:[`item.name`]="{ item }">
        <span class="blue--text font-weight-bold"> {{ item.name }} </span>
      </template>

      <!-- 自訂欄位風格範例：特定的欄位（例如「狀態」或「操作」）加工 -->
      <template v-slot:[`item.calories`]="{ item }">
        <!-- dark：讓標籤內部的文字顏色自動變成白色（適合深色背景）。small：讓標籤縮小，符合表格內部精緻的視覺 -->
        <v-chip :color="item.calories > 300 ? 'red' : 'green'" dark small>
          {{ item.calories }}
        </v-chip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  name: "SimpleTable",
  data() {
    return {
      selectedItems: [],
      // 1. 定義表頭 (Headers)
      headers: [
        {
          text: "甜點名稱",
          align: "center", // 文字對齊方向 ('start', 'center', 'end')
          sortable: true, // 這個欄位是否允許排序
          value: "name", // 對應資料物件 (Object) 中的 Key 值
        },
        { text: "卡路里 (Calories)", value: "calories" },
        { text: "脂肪 (g)", value: "fat" },
        { text: "蛋白質 (g)", value: "protein" },
      ],

      // 2. 定義表格實際要顯示的資料 (Items)
      desserts: [
        { name: "優格凍", calories: 159, fat: 6.0, protein: 4.0 },
        { name: "冰淇淋三明治", calories: 237, fat: 9.0, protein: 4.3 },
        { name: "閃電泡芙", calories: 260, fat: 16.0, protein: 6.0 },
        { name: "杯子蛋糕", calories: 305, fat: 3.7, protein: 4.3 },
        { name: "薑餅人", calories: 356, fat: 16.0, protein: 3.9 },
        { name: "果凍豆", calories: 375, fat: 0.0, protein: 0.0 },
      ],
    };
  },
  watch: {
    selectedItems(newVal) {
      const maxLimit = 3; // 設定最大限制筆數

      if (newVal.length > maxLimit) {
        alert(`最多隻能選擇 ${maxLimit} 筆資料！`);

        // 方法：將最後加進來的那一筆資料移除（保留前 3 筆）
        this.selectedItems = newVal.slice(0, maxLimit);
      }
    },
  },
};
</script>