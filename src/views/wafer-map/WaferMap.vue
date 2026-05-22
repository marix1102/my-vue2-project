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

      // 新增：目前被勾選要顯示的 Bin 陣列（預設全部勾選）
      selectedBins: [1, 2], 

      // 新增：內部統計計數器
      passCount: 0,
      failCount: 0,

      // 晶圓參數設定
      waferRadiusInDies: 30, 
      padding: 20, 
    };
  },
  watch: {
    // 💡 關鍵：當勾選狀態改變時，必須即時通知 Canvas 重新繪製
    selectedBins() {
      this.drawWafer();
    },
  },
  computed: {
    hoveredDieColor() {
      if (!this.hoveredDie) return "";
      return this.hoveredDie.bin === 1 ? "green" : "red";
    },
    // 動態計算整片晶圓良率
    grossYield() {
      if (this.totalDies === 0) return "0.00";
      return ((this.passCount / this.totalDies) * 100).toFixed(2);
    },
  },
  created() {
    // 非回應式大資料掛載
    this.rawWaferData = [];
    this.canvasSize = 500;
    this.dieWidth = 0;
    this.dieHeight = 0;
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

            // 同步計算好壞晶粒總數
            if (bin === 1) pCount++;
            else fCount++;
          }
        }
      }

      this.totalDies = data.length;
      this.passCount = pCount;
      this.failCount = fCount;

      this.rawWaferData = Object.freeze(data);
      this.drawWafer();
    },

    isDieFullyInsideWafer(x, y, R) {
      const corners = [
        { cx: x, cy: y }, 
        { cx: x + 1, cy: y }, 
        { cx: x, cy: y + 1 }, 
        { cx: x + 1, cy: y + 1 }, 
      ];
      return corners.every((corner) => {
        return corner.cx * corner.cx + corner.cy * corner.cy <= R * R;
      });
    },

    resizeCanvas() {
      const container = this.$refs.canvasContainer.$el; 
      if (!container) return;
      const size = Math.max(Math.min(container.clientWidth - 32, 600), 0); // 引入邊界截斷防禦
      this.canvasSize = size;

      const canvas = this.$refs.waferCanvas;
      if (canvas) {
        canvas.width = size;
        canvas.height = size;
        this.drawWafer();
      }
    },

    drawWafer() {
      const canvas = this.$refs.waferCanvas;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const size = this.canvasSize;
      const pad = this.padding;
      const usableSize = Math.max(size - pad * 2, 0);
      if (usableSize <= 0) return; 

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

      // B. 繪製所有四象限的 Die
      this.rawWaferData.forEach((die) => {
        // 💡 核心優化：如果該 Die 的 Bin Code 不在被勾選的 selectedBins 清單中，直接跳過不畫
        if (!this.selectedBins.includes(die.bin)) {
          return;
        }

        const pixelX = pixelCenterX + die.x * this.dieWidth;
        const pixelY = pixelCenterY - (die.y + 1) * this.dieHeight;

        ctx.fillStyle = die.bin === 1 ? "#4CAF50" : "#FF5252";
        ctx.fillRect(pixelX, pixelY, this.dieWidth - 0.5, this.dieHeight - 0.5);

        // Hover 框線選取提示（只有在該 Die 被渲染出來時才需要處理 Hover 外框）
        if (
          this.hoveredDie &&
          this.hoveredDie.x === die.x &&
          this.hoveredDie.y === die.y
        ) {
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 1;
          ctx.strokeRect(pixelX, pixelY, this.dieWidth, this.dieHeight);
        }
      });
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

      // 💡 互動防禦：只有當該 Die 有被渲染（存在於 selectedBins 中）時，滑鼠 Hover 才會抓到它
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