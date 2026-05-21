<template>
  <!-- 外層的大盒子（父元素） -->
  <div class="outer-box" @click="clickOuter" style="padding: 50px; background: lightgray;">
    我是外層大盒子
    
    <!-- 內層的按鈕（子元素）加上 .stop -->
    <button @click.stop="clickInner">
      點我（點擊不會傳到外層）
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    clickOuter() {
      alert('你點到了【外層大盒子】！');
    },
    clickInner() {
      alert('你點到了【內層按鈕】，而且事件被 .stop 攔截了！');
    }
  }
};
</script>