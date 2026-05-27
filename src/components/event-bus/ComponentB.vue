<template>
  <v-card class="pa-4" outlined color="blue lighten-5">
    <v-card-title class="subtitle-1 font-weight-bold">
      組件 B (接收端)
    </v-card-title>
    <v-card-text>
      <div class="body-1">
        接收到的訊息：
        <span class="blue--text font-weight-black">
          {{ receivedMessage || "目前尚無訊息" }}
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { EventBus } from "@/utils/event-bus";
import { TEST_MSG_EVENT } from "@/constants/event-types";

export default {
  name: "ComponentB",
  data() {
    return {
      receivedMessage: "",
    };
  },
  created() {
    // 在組件建立時，訂閱 'msg-dropped' 事件
    EventBus.$on(TEST_MSG_EVENT.DROPPED, (payload) => {
      this.receivedMessage = payload;
    });
  },
  beforeDestroy() {
    // 為了避免記憶體洩漏，組件銷毀前一定要解除監聽
    EventBus.$off(TEST_MSG_EVENT.DROPPED);
  },
};
</script>