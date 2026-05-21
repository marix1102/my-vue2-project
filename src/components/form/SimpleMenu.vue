<template>
  <v-container class="text-center mt-5">
    <v-menu offset-y transition="scale-transition">
      
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          <v-icon left>mdi-account</v-icon>
          我的帳戶
          <v-icon right>mdi-menu-down</v-icon>
        </v-btn>
      </template>

      <v-card min-width="200">
        <v-list dense>
          
          <v-list-item @click="goToProfile">
            <v-list-item-icon>
              <v-icon color="blue">mdi-account-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>個人資料</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="goToSettings">
            <v-list-item-icon>
              <v-icon color="grey">mdi-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>帳戶設定</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon color="red">mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="red--text">登出系統</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list>
      </v-card>
    </v-menu>
  </v-container>
</template>

<script>
export default {
  name: 'SimpleMenu',
  methods: {
    goToProfile() {
      alert('導向個人資料頁面');
    },
    goToSettings() {
      alert('導向設定頁面');
    },
    logout() {
      alert('執行登出邏輯...');
    }
  }
};
</script>