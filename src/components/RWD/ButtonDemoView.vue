<template>
  <v-card outlined class="mx-auto my-4">
    <v-card-title class="teal--text font-weight-bold">
      Vuetify 按鈕樣式展示 (Demo)
    </v-card-title>

    <!-- <div class="text-subtitle-1 px-4 grey--text text--darken-1">
      以下按鈕皆封裝在 v-card-text 內部，展現不同的視覺階層
    </div> -->

    <v-divider class="mt-2"></v-divider>

    <v-card-text>
      <v-row align="center" class="my-2">
        <v-col cols="4" class="text-subtitle-1 font-weight-bold"
          >1. 主色實心 (color)</v-col
        >
        <v-col cols="8">
          <v-btn color="primary">Primary 按鈕</v-btn>
        </v-col>
      </v-row>

      <v-row align="center" class="my-2">
        <v-col cols="4" class="text-subtitle-1 font-weight-bold"
          >2. 線框按鈕 (outlined)</v-col
        >
        <v-col cols="8">
          <v-btn color="success" outlined>成功線框</v-btn>
        </v-col>
      </v-row>

      <v-row align="center" class="my-2">
        <v-col cols="4" class="text-subtitle-1 font-weight-bold"
          >3. 文字按鈕 (text)</v-col
        >
        <v-col cols="8">
          <v-btn color="error" text>取消文字</v-btn>
        </v-col>
      </v-row>

      <v-row align="center" class="my-2">
        <v-col cols="4" class="text-subtitle-1 font-weight-bold"
          >4. 純圖標按鈕 (icon)</v-col
        >
        <v-col cols="8">
          <v-btn icon color="pink">
            <v-icon>mdi-heart</v-icon>
          </v-btn>

          <v-btn icon color="info" class="ml-2">
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions class="grey lighten-4 justify-end">
      <v-btn text color="grey darken-1" @click="moreInfo">了解更多</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ButtonDemoView",
  methods: {
    moreInfo() {
      console.log('按鈕被點擊了，了解更多...');
    }
  }
};
</script>