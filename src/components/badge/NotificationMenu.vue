<template>
  <v-app-bar
    color="teal darken-2"
    dark
    max-width="800"
    class="mx-auto mt-6 rounded-lg"
  >
    <v-toolbar-title class="font-weight-bold">
      <v-icon class="mr-2">mdi-chip</v-icon> Fab 廠區監控後台
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-menu offset-y left max-width="350" :close-on-content-click="false">
      <template slot="activator" slot-scope="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on" class="mr-2">
          <v-badge
            :value="unreadCount > 0"
            :content="unreadCount"
            color="error"
            overlap
          >
            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-card>
        <v-toolbar color="grey lighten-4" flat dense>
          <v-toolbar-title
            class="subtitle-1 font-weight-bold grey--text text--darken-3"
          >
            系統通知 ({{ unreadCount }})
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            v-if="unreadCount > 0"
            text
            x-small
            color="primary"
            @click="markAllAsRead"
          >
            全部標示已讀
          </v-btn>
        </v-toolbar>

        <v-list class="py-0" two-line max-height="400" style="overflow-y: auto">
          <v-list-item v-if="notifications.length === 0">
            <v-list-item-content class="text-center grey--text py-6">
              <v-icon size="40" class="mb-2" color="grey lighten-1">
                mdi-bell-off-outline
              </v-icon>
              <div>目前沒有任何系統通知</div>
            </v-list-item-content>
          </v-list-item>

          <div 
            v-else 
            v-for="(item, index) in notifications" 
            :key="item.id"
          >
            <v-list-item :class="{ 'amber lighten-5': !item.isRead }">
              <v-list-item-avatar
                :color="getNoticeColor(item.type)"
                class="white--text"
              >
                <v-icon small dark>{{ getNoticeIcon(item.type) }}</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title :class="{ 'font-weight-bold': !item.isRead }">
                  {{ item.title }}
                </v-list-item-title>
                <v-list-item-subtitle class="text--primary">
                  {{ item.message }}
                </v-list-item-subtitle>
                <v-list-item-subtitle class="grey--text text-caption mt-1">
                  {{ item.time }}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action v-if="!item.isRead">
                <v-btn icon small @click="markAsRead(item.id)">
                  <v-icon color="grey lighten-1">mdi-check-circle-outline</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>

            <v-divider v-if="index < notifications.length - 1"></v-divider>
          </div>
        </v-list>
      </v-card>
    </v-menu>

    <v-btn color="amber darken-4" small @click="simulateIncomingAlert">
      <v-icon left>mdi-plus</v-icon> 模擬異常推播
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "NotificationMenu",
  data() {
    return {
      notifications: [
        {
          id: 1,
          type: "error",
          title: "機台溫度過高警報",
          message: "FAB-01 擴散爐管 D01 溫度超出標準值上限！",
          time: "10 分鐘前",
          isRead: false,
        },
        {
          id: 2,
          type: "warning",
          title: "維護任務提醒",
          message: "塗佈顯影機 C01 預計於 2 小時後進行例行 PM。",
          time: "1 小時前",
          isRead: false,
        },
        {
          id: 3,
          type: "info",
          title: "系統排程通知",
          message: "今日晶圓產能日報表已自動生成並寄出。",
          time: "3 小時前",
          isRead: true,
        },
      ],
    };
  },
  computed: {
    unreadCount() {
      return this.notifications.filter((n) => !n.isRead).length;
    },
  },
  methods: {
    markAsRead(id) {
      const notice = this.notifications.find((n) => n.id === id);
      if (notice) notice.isRead = true;
    },
    markAllAsRead() {
      this.notifications.forEach((n) => (n.isRead = true));
    },
    simulateIncomingAlert() {
      const newId = Date.now();
      this.notifications.unshift({
        id: newId,
        type: "error",
        title: "🚨 壓降即時警報",
        message: `偵測到廠區電壓異常閃爍 (ID: ${newId.toString().slice(-4)})`,
        time: "剛剛",
        isRead: false,
      });
    },
    getNoticeColor(type) {
      if (type === "error") return "red";
      if (type === "warning") return "orange";
      return "blue";
    },
    getNoticeIcon(type) {
      if (type === "error") return "mdi-alert-circle";
      if (type === "warning") return "mdi-tools";
      return "mdi-information";
    },
  },
};
</script>