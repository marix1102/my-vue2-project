<template>
  <div class="counter">
    <img :alt="vueLogo" :src="logoPath" />
    <h2>{{ title }}</h2>
    <p>目前計數：{{ count }}</p>

    <button @click="decrease">- 減少</button>
    <button @click="increase">+ 增加</button>
    <button :disabled="isButtonDisabled">
      {{ isButtonDisabled ? '按鈕已被禁用' : '點我送出' }}
    </button>
  </div>
</template>

<script>
export default {
  name: "SimpleCounter",
  data() {
    return {
      vueLogo: "Vue logo",
      logoPath: require("../assets/logo.png"),
      title: "簡易計數器",
      count: 0,
      isButtonDisabled: true,
    };
  },
  methods: {
    increase() {
      this.count += 1;
    },
    decrease() {
      if (this.count > 0) {
        this.count -= 1;
      }
    },
  },
};
</script>

<!-- scoped 確保樣式只影響這個組件 -->
<style scoped>
.counter {
  text-align: center;
  margin-top: 50px;
}

button {
  margin: 0 10px;
  padding: 5px 10px;
}
</style>