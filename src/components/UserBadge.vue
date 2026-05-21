<template>
  <div class="status-block">
    <h3>目前使用者權限</h3>
    
    <!-- 依據 userRole 的值，只會有一段 HTML 被渲染出來 -->
    <p v-if="userRole === 'admin'">權限：管理員</p>
    <p v-else-if="userRole === 'editor'">權限：編輯人員</p>
    <p v-else>權限：👤 一般訪客</p>

    <!-- 測試按鈕，點擊可切換身分 -->
    <button @click="userRole = 'editor'">變更身分為編輯人員</button>
    <button @click="userRole = 'admin'">變更身分為管理員</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userRole: 'guest' // 可選值: 'admin', 'editor', 'guest'
    };
  }
};
</script>