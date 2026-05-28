export default {
  inserted(el, binding) {
    // 1. 一開始是純透明 Base64，並給予灰色背景
    el.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    el.style.backgroundColor = '#e0e0e0';
    el.style.transition = 'background-color 0.5s'; 

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {//進入畫面
          console.log('%c【指令通知】圖片進入畫面了！故意延遲 1.5 秒才載入...', 'color: #1976d2; font-weight: bold;');
          
          // 💡 故意加上 setTimeout 延遲 1.5 秒，讓肉眼絕對看得出效果
          setTimeout(() => {
            el.src = binding.value;
            
            el.onload = () => {
              el.style.backgroundColor = 'transparent';
              console.log('%c【指令通知】圖片真正載入完成！', 'color: #4caf50; font-weight: bold;');
            };
          }, 1500); 
          
          // 停止觀測
          observer.unobserve(el);
        }//else 離開畫面
      });
    });

    observer.observe(el);
  }
};