<template>
  <v-container class="py-8" style="max-width: 600px">
    <v-card class="pa-4">
      <v-card-title class="headline font-weight-bold primary--text">
        Event Bus 事件總線實測
      </v-card-title>
      <v-card-text>
        <p>A 與 B 是獨立的平級兄弟組件，彼此沒有父子關係。</p>

        <v-row>
          <v-col cols="12" md="6">
            <ComponentA />
          </v-col>
          <v-col cols="12" md="6">
            <ComponentB />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import ComponentA from "@/components/event-bus/ComponentA.vue";
import ComponentB from "@/components/event-bus/ComponentB.vue";

export default {
  name: "SimpleEventBus",
  components: {
    ComponentA,
    ComponentB,
  },
};
</script>