<template>
  <v-card class="pa-4" outlined color="amber lighten-5">
    <v-card-title class="subtitle-1 font-weight-bold">組件 A (發送端)</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="message"
        label="輸入想傳給組件 B 的話"
        outlined
        dense
      ></v-text-field>
      <v-btn color="warning" @click="sendMessage">廣播出去</v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { EventBus } from '@/utils/event-bus';
import { TEST_MSG_EVENT } from '@/constants/event-types';

export default {
  name: 'ComponentA',
  data() {
    return {
      message: ''
    };
  },
  methods: {
    sendMessage() {
      // 觸發自訂事件 'msg-dropped'，並把 message 當作參數傳出去
      EventBus.$emit(TEST_MSG_EVENT.DROPPED, this.message);
    }
  }
};
</script>