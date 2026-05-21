<template>
  <div>
    <!-- 加上 .prevent，點擊登入時網頁「不會」重新整理跳轉 -->
    <form @submit.prevent="handleLogin">
      <input type="text" placeholder="請輸入帳號">
      <button type="submit">登入</button>
    </form>
    
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return { message: '' };
  },
  methods: {
    handleLogin() {
      // 網頁沒有重新整理，我們可以在這裡安全地用 Ajax/axios 發送登入請求
      this.message = '正在驗證登入資訊...';
    }
  }
};
</script>