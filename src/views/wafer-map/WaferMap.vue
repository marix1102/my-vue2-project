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
      waferRadiusInDies: 30, // 預設 30，後續由後端動態覆蓋
      padding: 20,
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
        console.log('resData ',resData)
        // 解構後端響應結構
        this.waferRadiusInDies = resData.waferRadiusInDies;
        this.totalDies = resData.totalDies;
        this.passCount = resData.passCount;
        this.failCount = resData.failCount;

        this.rawWaferData = Object.freeze(resData.dies);

        // 渲染調度
        this.refreshMap();
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

      // A. Hard Bin 渲染模式
      if (this.renderMode === "hardBin") {
        if (!this.selectedBins.includes(props.bin)) return null; // 被過濾篩選掉，不渲染
        return props.bin === 1 ? "#4CAF50" : "#FF5252";
      }

      // B. 電壓參數熱力圖模式 (Voltage Heatmap)
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
        ctx.fillRect(pixelX, pixelY, this.dieWidth - 0.5, this.dieHeight - 0.5);
      });
    },

    refreshMap() {
      this.updateOffscreenCache();
      this.drawWafer();
    },

    // 輕量主畫布渲染層：純負責將離屏快取「一鍵貼上」並重疊當前 Hover 提示框
    drawWafer() {
      const canvas = this.$refs.waferCanvas;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 直接使用 GPU 快取拷貝貼圖
      ctx.drawImage(this.offscreenCanvas, 0, 0);

      // 疊加繪製：當前滑鼠單格 Hover 黑色提示外框
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
        this.refreshMap();
      }
    },
  },
};
</script>