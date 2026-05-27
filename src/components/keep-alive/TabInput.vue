<template>
  <div style="padding: 10px; background-color: #fff9c4; border: 1px solid #fbc02d;">
    <h4>分頁 A：填寫基本資料</h4>
    <label>姓名：</label>
    <input v-model="username" type="text" placeholder="請輸入姓名..." />
  </div>
</template>

<script>
export default {
  name: 'TabInput',
  data() {
    return { username: '' };
  }
};
</script>