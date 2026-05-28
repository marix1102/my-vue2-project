<template>
  <v-container class="py-6" style="max-width: 900px;">
    <v-row>
      <v-col cols="12" md="7" class="d-flex justify-center align-center">
        <v-card class="pa-2 grey lighten-3" flat outlined>
          <div class="composition-container">
            
            <img 
              src="https://picsum.photos/id/60/500/500" 
              class="base-layer" 
              alt="Wafer Base"
            />

            <div 
              class="data-layer"
              :style="{ 
                opacity: dataLayerOpacity,
                mixBlendMode: currentBlendMode 
              }"
            ></div>

            <svg 
              class="overlay-layer"
              :style="{ opacity: overlayLayerOpacity }"
              viewBox="0 0 500 500"
            >
              <circle cx="250" cy="250" r="230" stroke="#4caf50" stroke-width="4" fill="none" stroke-dasharray="10,5" />
              <g fill="#ff5252" stroke="#fff" stroke-width="2">
                <circle cx="180" cy="150" r="15" />
                <circle cx="200" cy="165" r="10" />
                <circle cx="350" cy="320" r="25" />
              </g>
              <text x="20" y="40" fill="#4caf50" font-weight="bold" font-size="16">DIE ZONE_A OK</text>
              <text x="320" y="280" fill="#ff5252" font-weight="bold" font-size="16">CRITICAL FAIL</text>
            </svg>

          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="headline font-weight-bold primary--text px-0 pt-0">
            多模態混合控制台
          </v-card-title>
          <v-divider class="mb-4"></v-divider>

          <v-card-text class="px-0 py-2">
            <div class="subtitle-1 font-weight-bold mb-1">
              📊 缺陷數據圖層透明度: {{ Math.round(dataLayerOpacity * 100) }}%
            </div>
            <v-slider
              v-model="dataLayerOpacity"
              min="0"
              max="1"
              step="0.01"
              hide-details
              thumb-label
              color="amber"
            ></v-slider>
          </v-card-text>

          <v-card-text class="px-0 py-2">
            <div class="subtitle-1 font-weight-bold mb-1">
              ✏️ 向量標註圖層透明度: {{ Math.round(overlayLayerOpacity * 100) }}%
            </div>
            <v-slider
              v-model="overlayLayerOpacity"
              min="0"
              max="1"
              step="0.01"
              hide-details
              thumb-label
              color="success"
            ></v-slider>
          </v-card-text>

          <v-card-text class="px-0 py-4">
            <div class="subtitle-1 font-weight-bold mb-2">🎨 混色模式 (Blend Mode)</div>
            <v-select
              v-model="currentBlendMode"
              :items="blendModes"
              item-text="text"
              item-value="value"
              outlined
              dense
              hide-details
            ></v-select>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'LayerCompositionDemo',
  data() {
    return {
      // 各圖層的響應式透明度變數
      dataLayerOpacity: 0.7,
      overlayLayerOpacity: 1.0,
      
      // 目前選擇的 CSS 混色模式
      currentBlendMode: 'multiply',
      
      // 常見的 CSS 專業混色模式清單
      blendModes: [
        { text: 'Normal (一般疊加)', value: 'normal' },
        { text: 'Multiply (色彩變暗/正片疊底 - 推薦)', value: 'multiply' },
        { text: 'Screen (濾色/變亮)', value: 'screen' },
        { text: 'Overlay (疊加/加強對比)', value: 'overlay' }
      ]
    };
  }
};
</script>

<style scoped>
/* 💡 Layer Composition 的 CSS 核心魔法 */

.composition-container {
  position: relative;     /* 讓所有子圖層可以以它為基準進行絕對定位 */
  width: 500px;
  height: 500px;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}

/* 1. 最底層的影像 */
.base-layer {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 2. 中間的數據圖層 - 用 CSS 漸層模擬複雜的熱力圖資料 */
.data-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;  /* 穿透點擊事件，不阻擋下層操作 */
  /* 模擬缺陷熱點的分佈資料 (放射狀漸層) */
  background: radial-gradient(circle at 35% 30%, rgba(255,0,0,1) 0%, rgba(255,165,0,0.8) 30%, rgba(0,0,255,0) 70%),
              radial-gradient(circle at 70% 65%, rgba(255,0,255,1) 0%, rgba(0,255,255,0.6) 40%, rgba(0,0,255,0) 80%);
  transition: opacity 0.1s ease;
}

/* 3. 最上層的 SVG 向量圖層 */
.overlay-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;  /* 穿透點擊事件 */
  transition: opacity 0.1s ease;
}
</style>