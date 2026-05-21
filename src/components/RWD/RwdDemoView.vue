<template>
  <v-container fluid class="grey lighten-4">
    
    <v-row 
      align="center" 
      justify="center" 
      style="min-height: 300px;"
    >
      
      <v-col cols="12" md="4">
        <v-card class="pa-4 text-center" color="primary" dark>
          <h3>欄位 1</h3>
          <p>xs 狀態下我會滿版</p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4 text-center" color="secondary" dark>
          <h3>欄位 2</h3>
          <p>md 狀態下我們並排</p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4 text-center" color="success" dark>
          <h3>欄位 3</h3>
          <p>垂直水平皆已居中</p>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'RwdDemoView'
}
</script>