<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="3">
        <v-card class="pa-4" outlined>
          <v-card-title class="headline">Wafer 資訊</v-card-title>
          <v-divider class="my-2"></v-divider>

          <v-list dense>
            <v-list-item>
              <v-list-item-content>當前四象限座標:</v-list-item-content>
              <v-list-item-content class="align-end font-weight-bold blue--text">
                {{ hoveredDie ? `(${hoveredDie.x}, ${hoveredDie.y})` : "無" }}
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>Bin Code:</v-list-item-content>
              <v-list-item-content
                class="align-end font-weight-bold"
                :style="{ color: hoveredDieColor }"
              >
                {{ hoveredDie ? `Bin ${hoveredDie.bin}` : "無" }}
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider class="my-2"></v-divider>
          <v-subheader class="pl-0 font-weight-bold">Bin Code 過濾篩選</v-subheader>
          
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
          <v-subheader class="pl-0 font-weight-bold">數據統計 (Summary)</v-subheader>

          <v-list dense class="pa-0">
            <v-list-item class="px-0">
              <v-list-item-content>總 Die 數 (Total):</v-list-item-content>
              <v-list-item-content class="align-end font-weight-bold">
                {{ totalDies }}
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="px-0">
              <v-list-item-content>合格數 (Pass):</v-list-item-content>
              <v-list-item-content class="align-end font-weight-bold green--text">
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
              <v-list-item-content class="align-end font-weight-bold blue--text">
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

          <v-btn color="primary" block class="mt-6" @click="generateWaferMap">
            重新生成測試資料
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
            @mouseleave="handleMouseLeave"
            style="border: 1px solid #ccc; background-color: #fafafa"
          ></canvas>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "WaferMapFourQuadrants",
  data() {
    return {
      hoveredDie: null,
      totalDies: 0,
      selectedBins: [1, 2], 
      passCount: 0,
      failCount: 0,
      waferRadiusInDies: 30, 
      padding: 20, 
    };
  },
  watch: {
    // 當過濾條件變更時，必須重新繪製離屏快取背景，再刷新主畫面
    selectedBins() {
      this.updateOffscreenCache();
      this.drawWafer();
    },
  },
  computed: {
    hoveredDieColor() {
      if (!this.hoveredDie) return "";
      return this.hoveredDie.bin === 1 ? "green" : "red";
    },
    grossYield() {
      if (this.totalDies === 0) return "0.00";
      return ((this.passCount / this.totalDies) * 100).toFixed(2);
    },
  },
  created() {
    // 非回應式變數避免 Vue 精準監聽耗損效能
    this.rawWaferData = [];
    this.canvasSize = 500;
    this.dieWidth = 0;
    this.dieHeight = 0;

    // 初始化記憶體中的離屏畫布與隱藏 Context 
    this.offscreenCanvas = document.createElement("canvas");
    this.offscreenCtx = this.offscreenCanvas.getContext("2d");
  },
  mounted() {
    this.generateWaferMap();
    this.resizeCanvas();
    window.addEventListener("resize", this.resizeCanvas);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCanvas);
  },
  methods: {
    generateWaferMap() {
      const data = [];
      const R = this.waferRadiusInDies;
      
      let pCount = 0;
      let fCount = 0;

      for (let x = -R; x <= R; x++) {
        for (let y = -R; y <= R; y++) {
          if (this.isDieFullyInsideWafer(x, y, R)) {
            const bin = Math.random() > 0.12 ? 1 : 2;
            data.push({ x, y, bin });

            if (bin === 1) pCount++;
            else fCount++;
          }
        }
      }

      this.totalDies = data.length;
      this.passCount = pCount;
      this.failCount = fCount;

      this.rawWaferData = Object.freeze(data);
      
      // 資料結構異動，重新烤焙快取底圖並重繪畫面
      this.updateOffscreenCache();
      this.drawWafer();
    },

    isDieFullyInsideWafer(x, y, R) {
      const corners = [
        { cx: x, cy: y }, 
        { cx: x + 1, cy: y }, 
        { cx: x, cy: y + 1 }, 
        { cx: x + 1, cy: y + 1 }, 
      ];
      return corners.every((corner) => corner.cx * corner.cx + corner.cy * corner.cy <= R * R);
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

        // 離屏畫布寬高必須與主畫布完全同步，貼圖才不會失真
        this.offscreenCanvas.width = size;
        this.offscreenCanvas.height = size;

        // 縮放尺寸後，重新烤焙底圖
        this.updateOffscreenCache();
        this.drawWafer();
      }
    },

    // 將昂貴的數萬次迴圈與圓框線製圖「預先烤焙」在離屏畫布上
    updateOffscreenCache() {
      const size = this.canvasSize;
      const pad = this.padding;
      const usableSize = Math.max(size - pad * 2, 0);
      if (usableSize <= 0) return; 

      const ctx = this.offscreenCtx;
      // 抹除離屏舊底圖
      ctx.clearRect(0, 0, size, size);

      const R = this.waferRadiusInDies;
      const totalGridUnits = R * 2 + 1;
      this.dieWidth = usableSize / totalGridUnits;
      this.dieHeight = usableSize / totalGridUnits;

      const pixelCenterX = size / 2;
      const pixelCenterY = size / 2;

      // A. 繪製 Wafer 圓框線
      const radiusInPixels = R * this.dieWidth; 
      ctx.beginPath();
      ctx.arc(pixelCenterX, pixelCenterY, radiusInPixels, 0, 2 * Math.PI);
      ctx.strokeStyle = "#444444";
      ctx.lineWidth = 2;
      ctx.stroke();

      // B. 繪製所有靜態 Die 點位
      this.rawWaferData.forEach((die) => {
        if (!this.selectedBins.includes(die.bin)) return;

        const pixelX = pixelCenterX + die.x * this.dieWidth;
        const pixelY = pixelCenterY - (die.y + 1) * this.dieHeight;

        ctx.fillStyle = die.bin === 1 ? "#4CAF50" : "#FF5252";
        ctx.fillRect(pixelX, pixelY, this.dieWidth - 0.5, this.dieHeight - 0.5);
      });
    },

    // 純負責貼圖快取與疊加 Hover 元素
    drawWafer() {
      const canvas = this.$refs.waferCanvas;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      
      // A. 清空主畫布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // B. 瞬間貼上預先畫好的離屏快取圖 (GPU 快取拷貝，接近 0ms)
      ctx.drawImage(this.offscreenCanvas, 0, 0);

      // C. 疊加繪製：當前滑鼠單格 Hover 黑色提示外框
      if (this.hoveredDie) {
        const pixelCenterX = this.canvasSize / 2;
        const pixelCenterY = this.canvasSize / 2;
        
        const pixelX = pixelCenterX + this.hoveredDie.x * this.dieWidth;
        const pixelY = pixelCenterY - (this.hoveredDie.y + 1) * this.dieHeight;

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        ctx.strokeRect(pixelX, pixelY, this.dieWidth, this.dieHeight);
      }
    },

    handleMouseMove(event) {
      const canvas = this.$refs.waferCanvas;
      const rect = canvas.getBoundingClientRect();

      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const pixelCenterX = this.canvasSize / 2;
      const pixelCenterY = this.canvasSize / 2;

      const gridX = Math.floor((mouseX - pixelCenterX) / this.dieWidth);
      const gridY = Math.floor((pixelCenterY - mouseY) / this.dieHeight);

      const foundDie = this.rawWaferData.find(
        (die) => die.x === gridX && die.y === gridY
      );

      if (foundDie && this.selectedBins.includes(foundDie.bin)) {
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
  },
};
</script>