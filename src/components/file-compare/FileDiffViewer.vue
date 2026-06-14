<template>
  <v-card
    class="mx-auto d-flex flex-column"
    outlined
    width="100%"
    height="100%"
  >
    <v-card-title
      class="subtitle-1 grey lighten-4 d-flex justify-space-between align-center py-2 px-4"
    >
      <div class="text-subtitle-2 text-truncate" style="max-width: 40%">
        {{ diffData.relativePath }}
      </div>
      <v-spacer></v-spacer>
      <v-btn
        icon
        @click="scrollToChunk('prev')"
        :disabled="currentChunkIndex <= 0"
      >
        <v-icon>mdi-chevron-up</v-icon>
      </v-btn>
      <span class="text-caption mx-2">
        {{ diffChunks.length > 0 ? currentChunkIndex + 1 : 0 }} /
        {{ diffChunks.length }}
      </span>
      <v-btn
        icon
        @click="scrollToChunk('next')"
        :disabled="currentChunkIndex >= diffChunks.length - 1"
      >
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
      <div class="ml-2">
        <v-chip
          small
          color="red lighten-4"
          class="red--text text--darken-4 mr-2 font-weight-bold"
        >
          - 舊版總行數: {{ diffData.leftTotalLines }}
        </v-chip>
        <v-chip
          small
          color="green lighten-4"
          class="green--text text--darken-4 font-weight-bold"
        >
          + 新版總行數: {{ diffData.rightTotalLines }}
        </v-chip>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pa-0 flex-grow-1 overflow-hidden d-flex flex-column">
      <div class="diff-viewport">
        <table class="diff-table">
          <colgroup>
            <col style="width: 55px" />
            <col style="width: 50%" />
            <col style="width: 55px" />
            <col style="width: 50%" />
          </colgroup>

          <thead>
            <tr>
              <th colspan="2" class="text-center version-header left-header">
                舊版本 (Left Form)
              </th>
              <th colspan="2" class="text-center version-header right-header">
                新版本 (Right Form)
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(row, index) in diffData.diffLines"
              :key="index"
              :id="`line-${index}`"
              :class="['diff-row', getRowClass(row.type)]"
            >
              <td class="line-number text-right unselectable">
                {{ row.leftLineNum || "" }}
              </td>
              <td
                :class="[
                  'code-cell',
                  row.leftContent === null ? 'empty-cell' : '',
                ]"
              >
                <div class="code-scroller">
                  <pre>{{ row.leftContent }}</pre>
                </div>
              </td>

              <td class="line-number text-right unselectable">
                {{ row.rightLineNum || "" }}
              </td>
              <td
                :class="[
                  'code-cell',
                  row.rightContent === null ? 'empty-cell' : '',
                ]"
              >
                <div class="code-scroller">
                  <pre>{{ row.rightContent }}</pre>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "FileDiffViewer",
  data() {
    return {
      diffData: {
        relativePath:
          "src/javaDiff/directoryCompare/DirectoryCompareProcessor.java",
        leftTotalLines: 95,
        rightTotalLines: 102,
        diffLines: [], // 後端傳入的比對行資料
      },
      diffChunks: [], // 儲存差異區塊的起始 index
      currentChunkIndex: -1, // 當前聚焦的區塊索引
    };
  },
  mounted() {
    // 模擬測試資料範例
    // this.diffData.diffLines = [
    //   { leftLineNum: 1, rightLineNum: 1, type: "UNCHANGED", leftContent: "public class Processor {", rightContent: "public class Processor {" },
    //   { leftLineNum: 2, rightLineNum: null, type: "DELETED", leftContent: "    private String oldStep;", rightContent: null },
    //   { leftLineNum: null, rightLineNum: 2, type: "ADDED", leftContent: null, rightContent: "    private String newStep;" },
    //   { leftLineNum: null, rightLineNum: 3, type: "ADDED", leftContent: null, rightContent: "    private boolean isActive;" },
    //   { leftLineNum: 3, rightLineNum: 4, type: "UNCHANGED", leftContent: "    public void process() {", rightContent: "    public void process() {" },
    //   { leftLineNum: 4, rightLineNum: 5, type: "MODIFIED", leftContent: "        System.out.println(\"Old\");", rightContent: "        System.out.println(\"New\");" },
    // ];
    this.diffData.diffLines = this.generateMock100Lines();
    // 初始化計算差異區塊
    this.calculateDiffChunks();
  },
  methods: {
    getRowClass(type) {
      switch (type) {
        case "ADDED":
          return "diff-added";
        case "DELETED":
          return "diff-deleted";
        case "MODIFIED":
          return "diff-modified";
        default:
          return "diff-unchanged";
      }
    },
    // 基於實際的 diffLines 計算連續差異區塊
    calculateDiffChunks() {
      const chunks = [];
      let inChunk = false;

      this.diffData.diffLines.forEach((row, index) => {
        const isDiffRow = row.type !== "UNCHANGED";
        if (isDiffRow) {
          if (!inChunk) {
            chunks.push(index); // 記錄連續差異區塊的第一行 index
            inChunk = true;
          }
        } else {
          inChunk = false;
        }
      });
      this.diffChunks = chunks;

      // 如果有差異，預設將焦點放在第一個區塊
      if (this.diffChunks.length > 0) {
        this.currentChunkIndex = 0;
      }
    },
    scrollToChunk(direction) {
      if (this.diffChunks.length === 0) return;

      if (direction === "next") {
        this.currentChunkIndex = Math.min(
          this.currentChunkIndex + 1,
          this.diffChunks.length - 1
        );
      } else {
        this.currentChunkIndex = Math.max(this.currentChunkIndex - 1, 0);
      }

      const targetLineIndex = this.diffChunks[this.currentChunkIndex];
      const element = document.getElementById(`line-${targetLineIndex}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    generateMock100Lines() {
      const list = [];

      // 1-10行: 基礎宣告 (Unchanged)
      list.push({
        type: "UNCHANGED",
        leftLineNum: 1,
        rightLineNum: 1,
        leftContent: "package javaDiff.directoryCompare;",
        rightContent: "package javaDiff.directoryCompare;",
      });
      list.push({
        type: "UNCHANGED",
        leftLineNum: 2,
        rightLineNum: 2,
        leftContent: "",
        rightContent: "",
      });
      list.push({
        type: "UNCHANGED",
        leftLineNum: 3,
        rightLineNum: 3,
        leftContent: "import java.io.BufferedReader;",
        rightContent: "import java.io.BufferedReader;",
      });
      list.push({
        type: "UNCHANGED",
        leftLineNum: 4,
        rightLineNum: 4,
        leftContent: "import java.io.IOException;",
        rightContent: "import java.io.IOException;",
      });
      list.push({
        type: "UNCHANGED",
        leftLineNum: 5,
        rightLineNum: 5,
        leftContent: "import java.io.InputStreamReader;",
        rightContent: "import java.io.InputStreamReader;",
      });
      list.push({
        type: "DELETED",
        leftLineNum: 6,
        rightLineNum: null,
        leftContent:
          "import java.util.Vector; // 舊時代的同步化陣列，效能較差且不符合現代網頁分離架構",
        rightContent: null,
      });
      list.push({
        type: "ADDED",
        leftLineNum: null,
        rightLineNum: 6,
        leftContent: null,
        rightContent:
          "import java.util.ArrayList; // 轉移至 Vue 2 後端架構改採輕量化 List",
      });
      list.push({
        type: "UNCHANGED",
        leftLineNum: 7,
        rightLineNum: 7,
        leftContent: "import java.util.TreeMap;",
        rightContent: "import java.util.TreeMap;",
      });
      list.push({
        type: "UNCHANGED",
        leftLineNum: 8,
        rightLineNum: 8,
        leftContent: "import java.util.zip.ZipEntry;",
        rightContent: "import java.util.zip.ZipEntry;",
      });
      list.push({
        type: "UNCHANGED",
        leftLineNum: 9,
        rightLineNum: 9,
        leftContent: "import java.util.zip.ZipFile;",
        rightContent: "import java.util.zip.ZipFile;",
      });
      list.push({
        type: "UNCHANGED",
        leftLineNum: 10,
        rightLineNum: 10,
        leftContent: "",
        rightContent: "",
      });

      // 11-20行: 類別宣告與超長代碼行測試 (測試水平滾動)
      list.push({
        type: "MODIFIED",
        leftLineNum: 11,
        rightLineNum: 11,
        leftContent:
          "public class DirectoryCompareProcessor { // 舊 Applet 核心比對器",
        rightContent:
          "public class DirectoryCompareProcessor implements Serializable { // 現代化無狀態 Servlet 核心比對處理元件，經優化調整",
      });
      list.push({
        type: "UNCHANGED",
        leftLineNum: 12,
        rightLineNum: 12,
        leftContent:
          "    // 測試超長程式碼行以驗證左右各 50% 獨立水平滾動軸的表現效果是否符合預期",
        rightContent:
          "    // 測試超長程式碼行以驗證左右各 50% 獨立水平滾動軸的表現效果是否符合預期",
      });
      list.push({
        type: "UNCHANGED",
        leftLineNum: 13,
        rightLineNum: 13,
        leftContent:
          '    public static final String COMPONENT_SYSTEM_INFO_LOG_HEADER_PREFIX_STRING_FOR_AUDIT = "[SYSTEM_AUDIT_LOG_INFO_VERSION_01_REFACTOR_STAGE]";',
        rightContent:
          '    public static final String COMPONENT_SYSTEM_INFO_LOG_HEADER_PREFIX_STRING_FOR_AUDIT = "[SYSTEM_AUDIT_LOG_INFO_VERSION_01_REFACTOR_STAGE]";',
      });
      list.push({
        type: "UNCHANGED",
        leftLineNum: 14,
        rightLineNum: 14,
        leftContent: "    private boolean ignoreCase;",
        rightContent: "    private boolean ignoreCase;",
      });
      list.push({
        type: "UNCHANGED",
        leftLineNum: 15,
        rightLineNum: 15,
        leftContent: "    private boolean ignoreAllWhitespace;",
        rightContent: "    private boolean ignoreAllWhitespace;",
      });
      for (let i = 16; i <= 25; i++) {
        list.push({
          type: "UNCHANGED",
          leftLineNum: i,
          rightLineNum: i,
          leftContent: `    private int mockFieldConfigurationLine_${i};`,
          rightContent: `    private int mockFieldConfigurationLine_${i};`,
        });
      }

      // 26-45行: 大段落刪除展示 (Deleted Block)
      list.push({
        type: "DELETED",
        leftLineNum: 26,
        rightLineNum: null,
        leftContent: "    @Deprecated",
        rightContent: null,
      });
      list.push({
        type: "DELETED",
        leftLineNum: 27,
        rightLineNum: null,
        leftContent: "    public void initAppletUserInterfaceComponents() {",
        rightContent: null,
      });
      list.push({
        type: "DELETED",
        leftLineNum: 28,
        rightLineNum: null,
        leftContent: "        // 原本舊有 Java Swing JTable 的初始化配置邏輯",
        rightContent: null,
      });
      list.push({
        type: "DELETED",
        leftLineNum: 29,
        rightLineNum: null,
        leftContent: "        this.tableModel = new DefaultTableModel();",
        rightContent: null,
      });
      for (let i = 30; i <= 44; i++) {
        list.push({
          type: "DELETED",
          leftLineNum: i,
          rightLineNum: null,
          leftContent: `        System.out.println("Legacy Applet UI Rendering Row Stack: " + ${i});`,
          rightContent: null,
        });
      }
      list.push({
        type: "DELETED",
        leftLineNum: 45,
        rightLineNum: null,
        leftContent: "    }",
        rightContent: null,
      });

      // 46-70行: 密集業務邏輯區 (混合 Unchanged 與 Modified)
      list.push({
        type: "UNCHANGED",
        leftLineNum: 46,
        rightLineNum: 16,
        leftContent:
          "    public void processCompareLogic() throws IOException {",
        rightContent:
          "    public void processCompareLogic() throws IOException {",
      });
      list.push({
        type: "UNCHANGED",
        leftLineNum: 47,
        rightLineNum: 17,
        leftContent: '        System.out.println("Start processing...");',
        rightContent: '        System.out.println("Start processing...");',
      });
      for (let i = 48; i <= 65; i++) {
        if (i % 5 === 0) {
          list.push({
            type: "MODIFIED",
            leftLineNum: i,
            rightLineNum: i - 30,
            leftContent: `        int calculateValueOld_${i} = index * 100; // 舊演算法`,
            rightContent: `        int calculateValueNew_${i} = index * 1000 + offset; // 新前端對應優化演算法`,
          });
        } else {
          list.push({
            type: "UNCHANGED",
            leftLineNum: i,
            rightLineNum: i - 30,
            leftContent: `        // 執行常規比對迴圈步進節點運算 #${i}`,
            rightContent: `        // 執行常規比對迴圈步進節點運算 #${i}`,
          });
        }
      }
      list.push({
        type: "UNCHANGED",
        leftLineNum: 66,
        rightLineNum: 36,
        leftContent: "        try {",
        rightContent: "        try {",
      });
      list.push({
        type: "UNCHANGED",
        leftLineNum: 67,
        rightLineNum: 37,
        leftContent: "            executeCoreDiffEngine();",
        rightContent: "            executeCoreDiffEngine();",
      });
      list.push({
        type: "UNCHANGED",
        leftLineNum: 68,
        rightLineNum: 38,
        leftContent: "        } catch(Exception ex) {",
        rightContent: "        } catch(Exception ex) {",
      });
      list.push({
        type: "MODIFIED",
        leftLineNum: 69,
        rightLineNum: 39,
        leftContent: '            logger.error("Error", ex);',
        rightContent:
          '            System.err.println("後端比對引擎異常中斷: " + ex.getMessage());',
      });
      list.push({
        type: "UNCHANGED",
        leftLineNum: 70,
        rightLineNum: 40,
        leftContent: "        }",
        rightContent: "        }",
      });

      // 71-95行: 大段落新增展示 (Added Block)
      for (let i = 71; i <= 94; i++) {
        list.push({
          type: "UNCHANGED",
          leftLineNum: i,
          rightLineNum: i - 30,
          leftContent: `        // 保持對齊之常規基礎代碼區塊排版 #${i}`,
          rightContent: `        // 保持對齊之常規基礎代碼區塊排版 #${i}`,
        });
      }
      list.push({
        type: "UNCHANGED",
        leftLineNum: 95,
        rightLineNum: 65,
        leftContent: "    }",
        rightContent: "    }",
      });
      list.push({
        type: "UNCHANGED",
        leftLineNum: 96,
        rightLineNum: 66,
        leftContent: "",
        rightContent: "",
      });

      // 97-120行: 新增方法區，包含右側超長行
      list.push({
        type: "ADDED",
        leftLineNum: null,
        rightLineNum: 67,
        leftContent: null,
        rightContent: "    /**",
      });
      list.push({
        type: "ADDED",
        leftLineNum: null,
        rightLineNum: 68,
        leftContent: null,
        rightContent:
          "     * 這是專為配合 Vue 2 + Vuetify 前端表格設計的新增輔助方法",
      });
      list.push({
        type: "ADDED",
        leftLineNum: null,
        rightLineNum: 69,
        leftContent: null,
        rightContent: "     */",
      });
      list.push({
        type: "ADDED",
        leftLineNum: null,
        rightLineNum: 70,
        leftContent: null,
        rightContent:
          "    public List<CompareRow> getFormattedJsonRowsResult() {",
      });
      list.push({
        type: "ADDED",
        leftLineNum: null,
        rightLineNum: 71,
        leftContent: null,
        rightContent:
          "        List<CompareRow> gridResultList = new ArrayList<>();",
      });
      for (let i = 72; i <= 100; i++) {
        if (i === 85) {
          list.push({
            type: "ADDED",
            leftLineNum: null,
            rightLineNum: i,
            leftContent: null,
            rightContent:
              '        gridResultList.add(new CompareRow("SUCCESS", System.currentTimeMillis(), "[AUDIT_TRAIL] Automated background servlet thread completely optimized by processor runner factory configuration instance"));',
          });
        } else {
          list.push({
            type: "ADDED",
            leftLineNum: null,
            rightLineNum: i,
            leftContent: null,
            rightContent: `        gridResultList.add(new CompareRow("NODE_${i}", this.currentTimestamp));`,
          });
        }
      }
      list.push({
        type: "ADDED",
        leftLineNum: null,
        rightLineNum: 101,
        leftContent: null,
        rightContent: "        return gridResultList;",
      });
      list.push({
        type: "ADDED",
        leftLineNum: null,
        rightLineNum: 102,
        leftContent: null,
        rightContent: "    }",
      });

      return list;
    },
  },
};
</script>

<style scoped>
.text-mono {
  font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
}

.diff-viewport {
  height: 100%;
  overflow-y: auto;
  background-color: #ffffff;
  flex-grow: 1;
}

.diff-table {
  width: 100%;
  table-layout: fixed; /* 確保嚴格遵循 colgroup 的百分比寬度 */
  border-collapse: collapse;
  font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
  font-size: 13px;
  line-height: 20px;
}

.diff-table th {
  padding: 8px;
  font-weight: 600;
  border-bottom: 2px solid #e1e4e8;
  background-color: #f6f8fa;
  color: #586069;
  position: sticky;
  top: 0;
  z-index: 2;
}
.left-header {
  border-right: 1px solid #ddd;
}

.line-number {
  color: rgba(27, 31, 35, 0.35);
  background-color: #f1f3f5;
  border-right: 1px solid #e1e4e8;
  padding: 0 8px;
  vertical-align: top;
  width: 55px;
  min-width: 55px;
}

.code-cell {
  padding: 0 !important;
  vertical-align: top;
  max-width: 0; /* 強制不撐開單元格 */
}

td.code-cell:nth-child(2) {
  border-right: 1px solid #e1e4e8;
}

.code-scroller {
  width: 100%;
  overflow-x: auto;
}

.code-scroller pre {
  margin: 0;
  padding: 0 10px;
  font-family: inherit;
  white-space: pre;
  word-break: normal;
}

.unselectable {
  user-select: none;
}

/* 滾動條樣式優化 */
.code-scroller::-webkit-scrollbar {
  height: 4px;
}
.diff-viewport::-webkit-scrollbar {
  width: 8px;
}
.code-scroller::-webkit-scrollbar-thumb,
.diff-viewport::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 4px;
}
.code-scroller::-webkit-scrollbar-thumb:hover,
.diff-viewport::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

.diff-unchanged:hover {
  background-color: #f8f9fa;
}

/* 差異高亮顏色調整：指定對應的 td 子元素 */
.diff-added .code-cell:nth-child(4) {
  background-color: #e6ffed;
  color: #22863a;
}
.diff-added .line-number:nth-child(3) {
  background-color: #cdffd8;
  color: #22863a;
  font-weight: bold;
}

.diff-deleted .code-cell:nth-child(2) {
  background-color: #ffeef0;
  color: #cb2431;
}
.diff-deleted .line-number:nth-child(1) {
  background-color: #ffd3d5;
  color: #cb2431;
  font-weight: bold;
}

.diff-modified .code-cell {
  background-color: #fffdef;
  color: #b07d00;
}
.diff-modified .line-number {
  background-color: #fff5b1;
  color: #b07d00;
}

.empty-cell {
  background-color: #fafbfc !important;
  background-image: repeating-linear-gradient(
    -45deg,
    #f6f8fa,
    #f6f8fa 4px,
    #edf0f2 4px,
    #edf0f2 8px
  ) !important;
}
</style>