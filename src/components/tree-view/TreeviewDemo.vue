<template>
  <v-container class="py-6" style="max-width: 800px;">
    <v-row>
      <v-col cols="12" md="7">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="headline font-weight-bold primary--text px-0 pt-0">
            廠區設備樹狀監控
          </v-card-title>
          <v-divider class="mb-4"></v-divider>

          <v-treeview
            selectable
            selected-color="primary" 
            v-model="selectedItems"
            :items="factoryData"
            open-on-click
            transition
          >
            <template v-slot:prepend="{ item, open }">
              <v-icon v-if="item.children">
                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
              </v-icon>
              <v-icon v-else :color="getDeviceColor(item.status)">
                {{ getDeviceIcon(item.status) }}
              </v-icon>
            </template>

            <template v-slot:label="{ item }">
              <span :class="{ 'font-weight-bold': item.children }">
                {{ item.name }}
              </span>
              <v-chip 
                v-if="item.status" 
                :color="getDeviceColor(item.status)" 
                x-small 
                dark 
                class="ml-2"
              >
                {{ item.status }}
              </v-chip>
            </template>
          </v-treeview>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="pa-4" color="blue-grey lighten-5" flat>
          <v-card-title class="subtitle-1 font-weight-bold px-0 pt-0">
            目前已選取的設備 ID
          </v-card-title>
          <v-divider class="mb-2"></v-divider>

          <v-card-text class="px-0">
            <div v-if="selectedItems.length === 0" class="grey--text">
              尚未選取任何設備
            </div>
            <v-chip-group column v-else>
              <v-chip 
                v-for="id in selectedItems" 
                :key="id" 
                color="primary" 
                small 
                dark
              >
                {{ id }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'TreeviewDemo',
  data() {
    return {
      // 儲存被勾選節點的 ID 陣列
      selectedItems: [],

      // 樹狀資料的標準格式：必須要有 id, name，和包裹子陣列的 children 欄位
      factoryData: [
        {
          id: 'FAB-01',
          name: '新竹科學園區一廠',
          children: [
            {
              id: 'AREA-YELLOW',
              name: '黃光區 (Lithography)',
              children: [
                { id: 'EQ-001', name: 'ASML 曝光機 A01', status: 'RUNNING' },
                { id: 'EQ-002', name: 'ASML 曝光機 A02', status: 'RUNNING' },
                { id: 'EQ-003', name: '塗佈顯影機 C01', status: 'MAINTAIN' }
              ]
            },
            {
              id: 'AREA-ETCH',
              name: '蝕刻區 (Etching)',
              children: [
                { id: 'EQ-004', name: 'LAM 蝕刻機 E01', status: 'RUNNING' },
                { id: 'EQ-005', name: 'LAM 蝕刻機 E02', status: 'DOWN' }
              ]
            }
          ]
        },
        {
          id: 'FAB-02',
          name: '台南科學園區六廠',
          children: [
            { id: 'EQ-201', name: '擴散爐管 D01', status: 'RUNNING' }
          ]
        }
      ]
    };
  },
  methods: {
    // 根據機台狀態派發不同的狀態顏色
    getDeviceColor(status) {
      switch (status) {
        case 'RUNNING': return 'success'; // 綠色
        case 'MAINTAIN': return 'warning'; // 橘色
        case 'DOWN': return 'error'; // 紅色
        default: return 'grey';
      }
    },
    // 根據機台狀態派發不同的狀態圖示
    getDeviceIcon(status) {
      switch (status) {
        case 'RUNNING': return 'mdi-play-circle';
        case 'MAINTAIN': return 'mdi-tools';
        case 'DOWN': return 'mdi-alert-circle';
        default: return 'mdi-help-circle';
      }
    }
  }
};
</script>