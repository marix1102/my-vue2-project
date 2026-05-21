<template>
  <v-app>
    <v-app-bar app color="primary" dark elevation="2">
      <v-toolbar-title class="font-weight-bold">TestVue</v-toolbar-title>
      
      <v-spacer></v-spacer>

      <v-btn to="/" text class="mr-1">首頁</v-btn>
      <!-- <v-btn to="/order" text class="mr-1">Order</v-btn>
      <v-btn to="/shopping" text class="mr-1">Shopping</v-btn> -->
      <v-btn to="/product" text class="mr-1">Product</v-btn>
      <v-btn to="/list" text>List</v-btn>
      <v-btn to="/about" text>About</v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-4">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
