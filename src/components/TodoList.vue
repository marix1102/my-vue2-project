<template>
  <div class="todo-list">
    <h3>今日待辦事項</h3>
    <ul>
      <!-- 必須綁定唯一的 :key -->
      <li v-for="(item, index) in todoList" :key="item.id">
        編號：{{ index + 1 }} - 任務：{{ item.task }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 每個物件都有獨立且唯一的 id
      todoList: [
        { id: 't01', task: '早上 10 點開週會' },
        { id: 't02', task: '撰寫專案規格書' },
        { id: 't03', task: '程式碼審查 (Code Review)' }
      ]
    };
  }
};
</script>