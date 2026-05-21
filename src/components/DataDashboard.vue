<template>
  <div class="dashboard">
    <h2 ref="mainTitle">📈 數據監控儀表板</h2>
    
    <p>後台資料：{{ apiData }}</p>
    <p>目前計時：已連線 <strong>{{ counter }}</strong> 秒</p>
    
    <button @click="apiData = '手動刷新資料'">手動更新資料</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      apiData: '載入中...',
      counter: 0,
      timerId: null // 用來儲存定時器 ID
    };
  },

  // 1. Created：資料已初始化，DOM 還沒產生
  created() {
    // 最適合在這裡發送 API 請求
    this.fetchRemoteData();
  },

  // 2. Mounted：組件已掛載到網頁上
  mounted() {
    // 此時才可以操作實際的 DOM 節點
    this.$refs.mainTitle.style.color = '#41b883'; // 成功將標題文字變綠色
    
    // 啟動一個每秒執行的定時器
    this.timerId = setInterval(() => {
      this.counter++;
    }, 1000);
  },

  // 3. Updated：當 data 改變，畫面重新渲染完成後
  updated() {
    // 當畫面上的數據被徹底更新後，才會觸發這裡
    console.log('畫面已重新渲染完成！目前最新資料為：' + this.apiData);
  },

  // 4. Destroyed：組件被銷毀（例如使用者切換分頁、離開此組件）
  destroyed() {
    // 必須在這裡清除定時器或解除全域監聽，否則會造成【記憶體洩漏】
    if (this.timerId) {
      clearInterval(this.timerId);
      console.log('組件已銷毀，定時器已成功清除！');
    }
  },

  methods: {
    fetchRemoteData() {
      // 模擬呼叫 API，2 秒後回傳資料
      setTimeout(() => {
        this.apiData = '✅ 成功從伺服器撈取到 2026 最新數據';
      }, 2000);
    }
  }
};
</script>