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

          <div v-if="roiStats" class="blue-grey lighten-5 pa-3 rounded mb-4" style="border: 1px dashed #607D8B">
            <div class="subtitle-2 font-weight-bold d-flex justify-space-between align-center text--primary">
              <span>🔍 區域選定統計 (ROI)</span>
              <v-btn icon small @click="clearROI"><v-icon small>mdi-close</v-icon></v-btn>
            </div>
            <v-list dense class="background-transparent pa-0 mt-1" style="background: transparent;">
              <v-list-item class="px-0">
                <v-list-item-content>區域內總數:</v-list-item-content>
                <v-list-item-content class="align-end font-weight-bold">
                  {{ roiStats.total }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="px-0">
                <v-list-item-content>區域內合格 (Pass):</v-list-item-content>
                <v-list-item-content class="align-end font-weight-bold green--text">
                  {{ roiStats.pass }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="px-0">
                <v-list-item-content>區域內不合格 (Fail):</v-list-item-content>
                <v-list-item-content class="align-end font-weight-bold red--text">
                  {{ roiStats.fail }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="px-0">
                <v-list-item-content>區域良率 (ROI Yield):</v-list-item-content>
                <v-list-item-content class="align-end font-weight-bold blue--text">
                  {{ roiStats.yield }} %
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-progress-linear
              :value="Number(roiStats.yield)"
              color="green"
              background-color="red"
              height="6"
              rounded
              class="mt-1"
            ></v-progress-linear>
          </div>

          <v-subheader class="pl-0 font-weight-bold">全片數據統計 (Summary)</v-subheader>

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
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseleave="handleMouseLeave"
            style="border: 1px solid #ccc; background-color: #fafafa; cursor: crosshair;"
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

      // 晶圓參數設定
      waferRadiusInDies: 30, 
      padding: 20,

      // 🔥 新增：ROI 狀態機
      isDragging: false,      // 是否正在拖曳框選中
      dragStart: null,        // 拖曳起點像素座標 {x, y}
      dragCurrent: null,      // 拖曳當前像素座標 {x, y}
      roiBounds: null,        // 框選完成後的邏輯範圍（四象限索引範圍）
      roiStats: null,         // ROI 良率統計結果
    };
  },
  watch: {
    selectedBins() {
      this.drawWafer();
      if (this.roiBounds) this.calculateROIOptimized(); // 篩選條件變更時同步重算 ROI
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
    this.rawWaferData = [];
    this.canvasSize = 500;
    this.dieWidth = 0;
    this.dieHeight = 0;
  },
  mounted() {
    this.generateWaferMap();
    this.resizeCanvas();
    window.addEventListener("resize", this.resizeCanvas);
    // 💡 在 window 級別監聽 mouseup，確保工程師滑鼠拖出 Canvas 外放開時，依然能正確收尾事件鏈
    window.addEventListener("mouseup", this.handleMouseUp);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCanvas);
    window.removeEventListener("mouseup", this.handleMouseUp);
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
      this.clearROI(); // 重新生成時清除舊的 ROI
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
      const size = Math.max(Math.min(container.clientWidth - 32, 600), 0);
      this.canvasSize = size;

      const canvas = this.$refs.waferCanvas;
      if (canvas) {
        canvas.width = size;
        canvas.height = size;
        this.drawWafer();
      }
    },

    // 2. 核心渲染引擎（融入固定 ROI 框與虛線動態拉框）
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
        if (!this.selectedBins.includes(die.bin)) return;

        const pixelX = pixelCenterX + die.x * this.dieWidth;
        const pixelY = pixelCenterY - (die.y + 1) * this.dieHeight;

        ctx.fillStyle = die.bin === 1 ? "#4CAF50" : "#FF5252";
        ctx.fillRect(pixelX, pixelY, this.dieWidth - 0.5, this.dieHeight - 0.5);

        // Hover 單格藍色提示外框
        if (this.hoveredDie && this.hoveredDie.x === die.x && this.hoveredDie.y === die.y) {
          ctx.strokeStyle = "#2196F3";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(pixelX, pixelY, this.dieWidth, this.dieHeight);
        }
      });

      // 🔥 C. 渲染動態拉框（拖曳中的虛線框）
      if (this.isDragging && this.dragStart && this.dragCurrent) {
        ctx.save();
        ctx.strokeStyle = "#607D8B";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]); // 建立 6px 實線、4px 空白的虛線效果
        const rectW = this.dragCurrent.x - this.dragStart.x;
        const rectH = this.dragCurrent.y - this.dragStart.y;
        ctx.strokeRect(this.dragStart.x, this.dragStart.y, rectW, rectH);
        
        // 給予微透明的遮罩底色，加強產線觀測感
        ctx.fillStyle = "rgba(96, 125, 139, 0.15)";
        ctx.fillRect(this.dragStart.x, this.dragStart.y, rectW, rectH);
        ctx.restore();
      }

      // 🔥 D. 渲染已固定的 ROI 框（放開滑鼠後的持久框線）
      if (!this.isDragging && this.roiBounds) {
        ctx.save();
        ctx.strokeStyle = "#00BCD4"; // 產線科技藍
        ctx.lineWidth = 2;
        
        // 從保存的四象限邏輯索引，反換算回當前的像素座標（支援 RWD resize 後位置不跑偏）
        const pX1 = pixelCenterX + this.roiBounds.minX * this.dieWidth;
        const pY1 = pixelCenterY - (this.roiBounds.maxY + 1) * this.dieHeight;
        const pX2 = pixelCenterX + (this.roiBounds.maxX + 1) * this.dieWidth;
        const pY2 = pixelCenterY - this.roiBounds.minY * this.dieHeight;

        ctx.strokeRect(pX1, pY1, pX2 - pX1, pY2 - pY1);
        ctx.fillStyle = "rgba(0, 188, 212, 0.08)";
        ctx.fillRect(pX1, pY1, pX2 - pX1, pY2 - pY1);
        ctx.restore();
      }
    },

    // 3. 事件鏈：滑鼠按下 (Mousedown)
    handleMouseDown(event) {
      const canvas = this.$refs.waferCanvas;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.isDragging = true;
      this.dragStart = { x, y };
      this.dragCurrent = { x, y };
      this.hoveredDie = null; // 框選時停用單格 Hover 提示
    },

    // 4. 事件鏈：滑鼠移動 (Mousemove)
    handleMouseMove(event) {
      const canvas = this.$refs.waferCanvas;
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      if (this.isDragging) {
        // A. 正在拉框狀態：僅更新像素座標並重繪
        this.dragCurrent = { x: mouseX, y: mouseY };
        this.drawWafer();
      } else {
        // B. 一般移動狀態：維持原有的單格 Hover 盲算反查
        const pixelCenterX = this.canvasSize / 2;
        const pixelCenterY = this.canvasSize / 2;

        const gridX = Math.floor((mouseX - pixelCenterX) / this.dieWidth);
        const gridY = Math.floor((pixelCenterY - mouseY) / this.dieHeight);

        const foundDie = this.rawWaferData.find(
          (die) => die.x === gridX && die.y === gridY
        );

        if (foundDie && this.selectedBins.includes(foundDie.bin)) {
          if (!this.hoveredDie || this.hoveredDie.x !== foundDie.x || this.hoveredDie.y !== foundDie.y) {
            this.hoveredDie = foundDie;
            this.drawWafer();
          }
        } else {
          this.handleMouseLeave();
        }
      }
    },

    // 5. 事件鏈：滑鼠放開 (Mouseup)
    handleMouseUp() {
      if (!this.isDragging) return;
      this.isDragging = false;

      // 檢查拉框位移量，若只是原地單擊則視為取消框選
      const distance = Math.hypot(this.dragCurrent.x - this.dragStart.x, this.dragCurrent.y - this.dragStart.y);
      if (distance < 5) {
        this.clearROI();
        return;
      }

      // 將拉框的起點與終點像素，盲算還原為「四象限邏輯座標區間」
      const pixelCenterX = this.canvasSize / 2;
      const pixelCenterY = this.canvasSize / 2;

      const gX1 = Math.floor((this.dragStart.x - pixelCenterX) / this.dieWidth);
      const gY1 = Math.floor((pixelCenterY - this.dragStart.y) / this.dieHeight);
      const gX2 = Math.floor((this.dragCurrent.x - pixelCenterX) / this.dieWidth);
      const gY2 = Math.floor((pixelCenterY - this.dragCurrent.y) / this.dieHeight);

      // 保存標準化的邊界，不論使用者是由左往右拉、還是由右往左斜拉
      this.roiBounds = {
        minX: Math.min(gX1, gX2),
        maxX: Math.max(gX1, gX2),
        minY: Math.min(gY1, gY2),
        maxY: Math.max(gY1, gY2)
      };

      this.calculateROIOptimized();
    },

    // 6. $O(1)$ 範圍過濾：高效能 ROI 良率統計
    calculateROIOptimized() {
      if (!this.roiBounds) return;

      let total = 0;
      let pass = 0;
      let fail = 0;

      // 走訪凍結的原始大陣列，利用剛才算出的邊界進行極其高效的範圍比對
      this.rawWaferData.forEach((die) => {
        // A. 判定是否落在框選的四象限幾何範圍內
        if (
          die.x >= this.roiBounds.minX &&
          die.x <= this.roiBounds.maxX &&
          die.y >= this.roiBounds.minY &&
          die.y <= this.roiBounds.maxY
        ) {
          // B. 只有當前「被勾選顯示」的 Bin Code 才納入統計計算
          if (this.selectedBins.includes(die.bin)) {
            total++;
            if (die.bin === 1) pass++;
            else fail++;
          }
        }
      });

      this.roiStats = {
        total,
        pass,
        fail,
        yield: total === 0 ? "0.00" : ((pass / total) * 100).toFixed(2)
      };

      this.drawWafer(); // 固化 ROI 藍色框線
    },

    clearROI() {
      this.roiBounds = null;
      this.roiStats = null;
      this.dragStart = null;
      this.dragCurrent = null;
      this.drawWafer();
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