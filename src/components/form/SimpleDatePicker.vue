<template>
  <v-container>
    <div style="max-width: 290px">
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="date"
            label="選擇日期"
            prepend-icon="mdi-calendar"
            readonly
            outlined
            dense
            v-bind="attrs"
            v-on="on"
            clearable
          ></v-text-field>
        </template>

        <v-date-picker
          v-model="date"
          locale="zh-tw"
          @input="menu = false"
        ></v-date-picker>
      </v-menu>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "SimpleDatePicker",
  data() {
    return {
      // 1. 綁定選取的日期（格式預設為字串 "YYYY-MM-DD"）
      // 你也可以給它預設值，例如 new Date().toISOString().substr(0, 10) 代表今天
      date: "",

      // 2. 控制日曆選單開關的布林值
      menu: false,
    };
  },
  methods: {
    onDatePickerInput(event) {
        console.log('onDatePickerInput ',event)
      this.menu = false;
    },
  },
};
</script>