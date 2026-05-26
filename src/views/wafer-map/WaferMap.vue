<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="3">
        <v-card class="pa-4" outlined>
          <v-card-title class="headline">Wafer 資訊</v-card-title>
          <v-divider class="my-2"></v-divider>

          <v-subheader class="pl-0 font-weight-bold">地圖渲染模式</v-subheader>
          <v-radio-group v-model="renderMode" row class="mt-0" hide-details>
            <v-radio label="Hard Bin 模式" value="hardBin"></v-radio>
            <v-radio
              label="電壓熱力圖 (Voltage)"
              value="voltageHeatmap"
            ></v-radio>
          </v-radio-group>

          <v-divider class="my-2"></v-divider>

          <v-list dense>
            <v-list-item>
              <v-list-item-content>當前座標:</v-list-item-content>
              <v-list-item-content
                class="align-end font-weight-bold blue--text"
              >
                {{ hoveredDie ? `(${hoveredDie.x}, ${hoveredDie.y})` : "無" }}
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>詳細數據庫:</v-list-item-content>
              <v-list-item-content
                class="align-end font-weight-bold caption"
                style="text-align: right"
              >
                <template v-if="hoveredDie">
                  Hard Bin: {{ hoveredDie.properties.bin }}<br />
                  Soft Bin: {{ hoveredDie.properties.softBin }}<br />
                  Voltage: {{ hoveredDie.properties.voltage }} V
                </template>
                <template v-else>無</template>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider class="my-2"></v-divider>
          <v-subheader class="pl-0 font-weight-bold"
            >Bin Code 過濾篩選</v-subheader
          >

          <v-checkbox
            v-model="selectedBins"
            label="Bin 1 (良品 - 綠色)"
            color="green"
            :value="1"
            hide-details
            class="mt-0"
          ></v-checkbox>
          <v-checkbox
            v-model="selectedBins"
            label="Bin 2 (不良品 - 紅色)"
            color="red"
            :value="2"
            hide-details
          ></v-checkbox>

          <v-divider class="my-4"></v-divider>
          <v-subheader class="pl-0 font-weight-bold"
            >數據統計 (Summary)</v-subheader
          >

          <v-list dense class="pa-0">
            <v-list-item class="px-0">
              <v-list-item-content>總 Die 數 (Total):</v-list-item-content>
              <v-list-item-content class="align-end font-weight-bold">
                {{ totalDies }}
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="px-0">
              <v-list-item-content>合格數 (Pass):</v-list-item-content>
              <v-list-item-content
                class="align-end font-weight-bold green--text"
              >
                {{ passCount }}
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="px-0">
              <v-list-item-content>不合格數 (Fail):</v-list-item-content>
              <v-list-item-content class="align-end font-weight-bold red--text">
                {{ failCount }}
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="px-0">
              <v-list-item-content>整片良率 (Gross Yield):</v-list-item-content>
              <v-list-item-content
                class="align-end font-weight-bold blue--text"
              >
                {{ grossYield }} %
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-progress-linear
            :value="grossYield"
            color="green"
            background-color="red"
            height="10"
            rounded
            class="mt-2"
          ></v-progress-linear>

          <v-divider class="my-2"></v-divider>

          <v-subheader class="pl-0 font-weight-bold">畫布視角操作</v-subheader>
          <div class="caption grey--text text--darken-1 mb-2">
            滾輪：放大/縮小 <br />
            拖拽：按住滑鼠左鍵移動
          </div>
          <v-btn small block color="primary" outlined @click="resetView">
            重設視角 (Reset View)
          </v-btn>

        </v-card>
      </v-col>

      <v-col cols="12" md="9">
        <v-card
          ref="canvasContainer"
          class="d-flex justify-center align-center pa-2"
          outlined
          style="position: relative; min-height: 500px"
        >
          <canvas
            ref="waferCanvas"
            @mousemove="handleMouseMove"
            @mousedown="handleMouseDown"
            @mouseup="handleMouseUp"
            @mouseleave="handleCanvasLeave"
            @wheel.prevent="handleWheel"
            style="border: 1px solid #ccc; background-color: #fafafa; cursor: grab;"
          ></canvas>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getWaferMapData } from '@/api/wafer'

export default {
  name: "WaferMapDataDriven",
  data() {
    return {
      loading: false,
      hoveredDie: null,
      totalDies: 0,
      selectedBins: [1, 2],
      renderMode: "hardBin",
      passCount: 0,
      failCount: 0,
      waferRadiusInDies: 30, 
      padding: 20,

      //縮放與平移視角控制狀態
      scale: 1,         // 目前放大倍率 (1 為原始大小)
      offsetX: 0,       // X 軸平移像素
      offsetY: 0,       // Y 軸平移像素
      isDragging: false // 是否正按著滑鼠拖拽中
    };
  },
  watch: {
    selectedBins() {
      this.refreshMap();
    },
    renderMode() {
      this.refreshMap();
    },
  },
  computed: {
    hoveredDieColor() {
      if (!this.hoveredDie) return "";
      return this.hoveredDie.properties.bin === 1 ? "green" : "red";
    },
    grossYield() {
      if (this.totalDies === 0) return "0.00";
      return ((this.passCount / this.totalDies) * 100).toFixed(2);
    },
  },
  created() {
    this.rawWaferData = [];
    this.canvasSize = 500;
    this.dieWidth = 0;
    this.dieHeight = 0;

    // 用於記錄拖拽滑鼠前一個瞬間的物理點
    this.dragStart = { x: 0, y: 0 };

    this.offscreenCanvas = document.createElement("canvas");
    this.offscreenCtx = this.offscreenCanvas.getContext("2d");
  },
  mounted() {
    this.fetchWaferMapFromBackend();
    this.resizeCanvas();
    window.addEventListener("resize", this.resizeCanvas);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCanvas);
  },
  methods: {
    // 異步非同步讀取後端資料
    async fetchWaferMapFromBackend() {
      this.loading = true;
      try {
        const resData = await getWaferMapData();
        this.waferRadiusInDies = resData.waferRadiusInDies;
        this.totalDies = resData.totalDies;
        this.passCount = resData.passCount;
        this.failCount = resData.failCount;

        this.rawWaferData = Object.freeze(resData.dies);
        
        // 載入新資料時重設視角，確保圖表居中
        this.resetView(); 
      } catch (error) {
        console.error("無法自 Spring Boot 獲取晶圓圖資料:", error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * 色彩與過濾適配器
     * 相容後端 properties 封裝，任何動態欄位擴充只要在此修改對應即可
     */
    colorAdapter(die) {
      const props = die.properties;
      if (!props) return "#CCCCCC";

      if (this.renderMode === "hardBin") {
        if (!this.selectedBins.includes(props.bin)) return null; // 被過濾篩選掉，不渲染
        return props.bin === 1 ? "#4CAF50" : "#FF5252";
      }

      if (this.renderMode === "voltageHeatmap") {
        // 假設實體安全電壓區間落在 0.5V ~ 1.3V，將其對應為動態色階
        const minV = 0.5;
        const maxV = 1.3;
        const ratio = Math.min(
          Math.max((props.voltage - minV) / (maxV - minV), 0),
          1
        );

        // 240度(藍色, 低壓) 到 0度(紅色, 高壓) 的 HSL 色階漸層轉換，每隔120度佔據一個核心位置：0度或360度：紅色，120度：綠色，240度：藍色
        const hue = (1 - ratio) * 240;
        return `hsl(${hue}, 100%, 50%)`;
      }
      return "#CCCCCC";
    },

    // 維持繪製完整的 1:1 原始地圖快取 (不受 Pan/Zoom 影響)
    updateOffscreenCache() {
      const size = this.canvasSize;
      const pad = this.padding;
      const usableSize = Math.max(size - pad * 2, 0);
      if (usableSize <= 0) return;

      const ctx = this.offscreenCtx;
      ctx.clearRect(0, 0, size, size);

      const R = this.waferRadiusInDies;
      const totalGridUnits = R * 2 + 1;
      this.dieWidth = usableSize / totalGridUnits;
      this.dieHeight = usableSize / totalGridUnits;

      const pixelCenterX = size / 2;
      const pixelCenterY = size / 2;

      // 繪製 Wafer 圓框線
      const radiusInPixels = R * this.dieWidth;
      ctx.beginPath();
      ctx.arc(pixelCenterX, pixelCenterY, radiusInPixels, 0, 2 * Math.PI);
      ctx.strokeStyle = "#444444";
      ctx.lineWidth = 2;
      ctx.stroke();

      // 迭代繪製所有靜態 Die 點位
      this.rawWaferData.forEach((die) => {
        const color = this.colorAdapter(die);
        if (!color) return;

        const pixelX = pixelCenterX + die.x * this.dieWidth;
        const pixelY = pixelCenterY - (die.y + 1) * this.dieHeight;

        ctx.fillStyle = color;
        // 留 0.3 像素作為網格線格線感
        ctx.fillRect(pixelX, pixelY, this.dieWidth - 0.3, this.dieHeight - 0.3);
      });
    },

    refreshMap() {
      this.updateOffscreenCache();
      this.drawWafer();
    },

    // 在此處實作平移與縮放矩陣操作
    drawWafer() {
      const canvas = this.$refs.waferCanvas;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 保存乾淨的初始狀態環境
      ctx.save();
      
      // 先平移到當前拖拽位移，再進行縮放
      ctx.translate(this.offsetX, this.offsetY);
      ctx.scale(this.scale, this.scale);

      // 將 1:1 的離屏快取圖，透過矩陣縮放畫上主畫布
      ctx.drawImage(this.offscreenCanvas, 0, 0);

      // 當前滑鼠單格 Hover 提示外框
      if (this.hoveredDie) {
        const pixelCenterX = this.canvasSize / 2;
        const pixelCenterY = this.canvasSize / 2;

        const pixelX = pixelCenterX + this.hoveredDie.x * this.dieWidth;
        const pixelY = pixelCenterY - (this.hoveredDie.y + 1) * this.dieHeight;

        ctx.strokeStyle = "#000000";
        // 隨著放大，提示線條寬度等比例縮小，避免外框變粗太醜
        ctx.lineWidth = 1 / this.scale; 
        ctx.strokeRect(pixelX, pixelY, this.dieWidth, this.dieHeight);
      }

      // 恢復畫布狀態
      ctx.restore();
    },

    // 滑鼠滾輪事件處理 (以滑鼠所在位置為中心點進行縮放)
    handleWheel(event) {
      const canvas = this.$refs.waferCanvas;
      const rect = canvas.getBoundingClientRect();
      
      // 取得目前滑鼠在畫布上的物理像素座標
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // 計算縮放係數
      const zoomFactor = 1.1;
      //event.deltaY 滑鼠滾輪
      let newScale = event.deltaY < 0 ? this.scale * zoomFactor : this.scale / zoomFactor;
      
      // 限制縮放範圍：最小 1 倍，最大 40 倍（防止縮太小或無限放大放大）
      newScale = Math.min(Math.max(newScale, 1), 40);

      if (newScale === this.scale) return;

      // 調整平移補償，使縮放時「滑鼠所指的點」不會飄走
      this.offsetX = mouseX - (mouseX - this.offsetX) * (newScale / this.scale);
      this.offsetY = mouseY - (mouseY - this.offsetY) * (newScale / this.scale);
      this.scale = newScale;

      // 縮放時同步更新當前滑鼠下的 Die 提示
      this.calculateHoverDie(event);
      this.drawWafer();
    },

    // 滑鼠左鍵點下開始拖拽平移
    handleMouseDown(event) {
      if (event.button !== 0) return; // 只允許左鍵拖拽
      this.isDragging = true;
      this.$refs.waferCanvas.style.cursor = 'grabbing';
      
      this.dragStart.x = event.clientX - this.offsetX;
      this.dragStart.y = event.clientY - this.offsetY;
    },

    // 放開滑鼠
    handleMouseUp() {
      this.isDragging = false;
      if (this.$refs.waferCanvas) {
        this.$refs.waferCanvas.style.cursor = 'grab';
      }
    },

    // 滑鼠離開畫布
    handleCanvasLeave() {
      this.handleMouseUp();
      this.handleMouseLeave();
    },

    // 滑鼠移動時
    handleMouseMove(event) {
      if (this.isDragging) {
        // 處理視角平移
        this.offsetX = event.clientX - this.dragStart.x;
        this.offsetY = event.clientY - this.dragStart.y;
        
        // 平移時不觸發新的 Hover 資訊更新
        this.drawWafer();
      } else {
        // 純移動時計算 Hover 晶粒
        this.calculateHoverDie(event);
      }
    },

    //引入逆矩陣，精確計算縮放平移後的 Die 座標
    calculateHoverDie(event) {
      const canvas = this.$refs.waferCanvas;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();

      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // 將畫布的「物理滑鼠座標」反推回原始 1:1 的「虛擬快取座標」
      const transformedX = (mouseX - this.offsetX) / this.scale;
      const transformedY = (mouseY - this.offsetY) / this.scale;

      const pixelCenterX = this.canvasSize / 2;
      const pixelCenterY = this.canvasSize / 2;

      // 使用反推後的座標計算邏輯網格位置
      const gridX = Math.floor((transformedX - pixelCenterX) / this.dieWidth);
      const gridY = Math.floor((pixelCenterY - transformedY) / this.dieHeight);

      const foundDie = this.rawWaferData.find(
        (die) => die.x === gridX && die.y === gridY
      );

      // 滑鼠互動判定解耦：向適配器確認該點目前在畫面上是否「可見（非 null）」
      if (foundDie && this.colorAdapter(foundDie) !== null) {
        if (
          !this.hoveredDie ||
          this.hoveredDie.x !== foundDie.x ||
          this.hoveredDie.y !== foundDie.y
        ) {
          this.hoveredDie = foundDie;
          this.drawWafer();
        }
      } else {
        this.handleMouseLeave();
      }
    },

    handleMouseLeave() {
      if (this.hoveredDie) {
        this.hoveredDie = null;
        this.drawWafer();
      }
    },

    // 一鍵回歸初始視角
    resetView() {
      this.scale = 1;
      this.offsetX = 0;
      this.offsetY = 0;
      this.hoveredDie = null;
      this.refreshMap();
    },

    resizeCanvas() {
      const container = this.$refs.canvasContainer.$el;
      if (!container) return;
      const size = Math.max(Math.min(container.clientWidth - 32, 600), 0);
      this.canvasSize = size;

      const canvas = this.$refs.waferCanvas;
      if (canvas) {
        canvas.width = size;
        canvas.height = size;
        this.offscreenCanvas.width = size;
        this.offscreenCanvas.height = size;
        // 視窗大小改變時重設視角，避免畫面歪掉
        this.resetView(); 
      }
    },
  },
};
</script>