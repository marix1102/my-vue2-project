// 一個輔助函式：用來建立或更新紅點 DOM 的內容
function updateBadgeElement(el, binding) {
  const count = binding.value || 0;
  
  // 嘗試尋找是不是已經有建立過徽章的 <span> 節點了
  let badgeEl = el.querySelector('.custom-badge-dot');

  // 如果數量大於 0
  if (count > 0) {
    // 如果之前沒建立過，就用原生 JS 刻一個 <span> 放進去
    if (!badgeEl) {
      badgeEl = document.createElement('span');
      badgeEl.className = 'custom-badge-dot';
      
      // 透過 JS 給予基本樣式（右上角絕對定位、紅色圓圈）
      badgeEl.style.position = 'absolute';
      badgeEl.style.top = '-8px';
      badgeEl.style.right = '-8px';
      badgeEl.style.backgroundColor = '#ff5252';
      badgeEl.style.color = 'white';
      badgeEl.style.fontSize = '12px';
      badgeEl.style.fontWeight = 'bold';
      badgeEl.style.borderRadius = '10px';
      badgeEl.style.padding = '2px 6px';
      badgeEl.style.lineHeight = '1';
      
      // 確保父元素有相對定位，紅點才不會飄走
      el.style.position = 'relative';
      el.appendChild(badgeEl);
    }
    
    // 更新紅點內部的文字為最新的數字
    badgeEl.textContent = count;
  } else {
    // 如果數量變回 0，且畫面上存在紅點，就直接從 DOM 中移除它
    if (badgeEl) {
      badgeEl.remove();
    }
  }
}

export default {
  // 1. 首次插入 DOM 時：根據初始數值決定要不要畫出紅點
  inserted(el, binding) {
    updateBadgeElement(el, binding);
  },

  // 2. 💡 關鍵焦點：當組件更新、傳入的值（binding.value）發生改變時觸發
  update(el, binding) {
    // binding.value 是當前最新值，binding.oldValue 是改變前的值
    if (binding.value !== binding.oldValue) {
      console.log(`【指令 Update】數值從 ${binding.oldValue} 變成了 ${binding.value}`);
      updateBadgeElement(el, binding);
    }
  }
};