<template>
      <v-container class="py-8" style="max-width: 400px;">
        <v-card class="pa-6 text-center">
          <v-card-title class="headline font-weight-bold justify-center primary--text mb-4">
            v-badge 指令 update 實測
          </v-card-title>

          <v-btn 
            v-badge="cartCount" 
            color="primary" 
            fab 
            large
            class="my-6"
          >
            <v-icon>mdi-cart</v-icon>
          </v-btn>

          <v-card-text class="subtitle-1">
            目前購物車數量：<strong>{{ cartCount }}</strong> 件
          </v-card-text>

          <v-card-actions class="justify-center">
            <v-btn color="error" outlined @click="cartCount > 0 ? cartCount-- : 0">
              <v-icon>mdi-minus</v-icon> 減少
            </v-btn>
            <v-btn color="success" @click="cartCount++">
              <v-icon>mdi-plus</v-icon> 增加
            </v-btn>
          </v-card-actions>
          
        </v-card>
      </v-container>
</template>

<script>
export default {
  name: 'BadgeVue',
  data() {
    return {
      cartCount: 0 // 初始數量為 0
    };
  }
};
</script>