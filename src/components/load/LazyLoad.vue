<template>
      <v-container class="py-8" style="max-width: 600px;">
        
        <v-card class="pa-4 mb-6" elevation="2">
          <v-card-title class="headline font-weight-bold primary--text">
            自訂指令 v-lazy 懶加載測試
          </v-card-title>
          <v-card-text>
            請向下捲動網頁。注意看：下面的圖片在「快要滾入畫面」之前都是 Loading 狀態，滾到定位後才會真正觸發網路請求載入圖片！
          </v-card-text>
        </v-card>

        <v-sheet class="d-flex align-center justify-center my-12" height="600" color="grey lighten-3" rounded="lg">
          <span class="grey--text subtitle-1">↓↓ 請往下捲動 ↓↓</span>
        </v-sheet>

        <v-row>
          <v-col cols="12" class="text-center">
            <h3 class="mb-4">第一張大圖</h3>
            <img 
              v-lazy="'https://picsum.photos/id/10/500/350'" 
              style="width: 100%; max-width: 500px; height: 350px; border-radius: 8px; object-fit: cover;"
              alt="隨機圖片 1"
            />
          </v-col>

          <v-col cols="12" style="height: 400px;"></v-col>

          <v-col cols="12" class="text-center">
            <h3 class="mb-4">第二張大圖</h3>
            <img 
              v-lazy="'https://picsum.photos/id/20/500/350'" 
              style="width: 100%; max-width: 500px; height: 350px; border-radius: 8px; object-fit: cover;"
              alt="隨機圖片 2"
            />
          </v-col>
        </v-row>

      </v-container>
</template>

<script>
export default {
  name: 'LazyLoad'
};
</script>