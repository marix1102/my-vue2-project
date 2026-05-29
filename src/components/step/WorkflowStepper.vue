<template>
  <v-container class="py-6" style="max-width: 850px;">
    <v-stepper v-model="currentStep" class="elevation-2">
      
      <v-stepper-header>
        <v-stepper-step :complete="currentStep > 1" step="1" editable>
          選擇基礎配方
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="currentStep > 2" step="2">
          參數微調
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3">
          覆核與送出
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        
        <v-stepper-content step="1">
          <v-card class="mb-5 py-2" flat>
            <v-card-title class="px-0 subtitle-1 font-weight-bold primary--text">
              請選擇此批次要套用的 Recipe 範本
            </v-card-title>
            
            <v-radio-group v-model="formData.recipe" mandatory>
              <v-radio label="標準 7奈米 邏輯晶片製程 (Recipe-7NM-LOGIC)" value="7nm"></v-radio>
              <v-radio label="高規格 5奈米 高效能運算製程 (Recipe-5NM-HPC)" value="5nm"></v-radio>
              <v-radio label="實驗性 3奈米 GAA 測試架構 (Recipe-3NM-GAA)" value="3nm"></v-radio>
            </v-radio-group>
          </v-card>

          <v-btn color="primary" @click="currentStep = 2">
            下一步：參數設定 <v-icon right>mdi-arrow-right</v-icon>
          </v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card class="mb-5" flat>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.temperature"
                  label="爐管目標溫度 (°C)"
                  type="number"
                  suffix="°C"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.gasFlow"
                  label="反應氣體流量 (sccm)"
                  type="number"
                  suffix="sccm"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card>

          <v-btn color="primary" @click="currentStep = 3">
            下一步：覆核確認 <v-icon right>mdi-arrow-right</v-icon>
          </v-btn>
          <v-btn text @click="currentStep = 1" class="ml-2">返回</v-btn>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card class="mb-5 grey lighten-4 pa-4" flat outlined>
            <div class="subtitle-1 font-weight-bold mb-3">請再次確認以下生產參數：</div>
            
            <v-simple-table dense class="grey lighten-4">
              <template v-slot:default>
                <tbody>
                  <tr>
                    <td class="font-weight-bold" style="width: 150px;">製程配方:</td>
                    <td class="text-uppercase primary--text font-weight-bold">{{ formData.recipe }}製程</td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">設定溫度:</td>
                    <td>{{ formData.temperature }} °C</td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">氣體流量:</td>
                    <td>{{ formData.gasFlow }} sccm</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>

          <v-btn color="success" @click="submitWorkflow" :loading="isSubmitting">
            <v-icon left>mdi-check</v-icon> 標記核准並發送工單
          </v-btn>
          <v-btn text @click="currentStep = 2" :disabled="isSubmitting" class="ml-2">返回修改</v-btn>
        </v-stepper-content>

      </v-stepper-items>
    </v-stepper>

    <v-snackbar v-model="showSnackbar" color="success" top>
      🎉 成功建立生產批次單！已指派至對應機台。
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: "WorkflowStepper",
  data() {
    return {
      // 💡 控制當前正處於哪一個步驟（從 1 開始）
      currentStep: 1,
      
      // 表單資料收集
      formData: {
        recipe: "7nm",
        temperature: 1050,
        gasFlow: 250,
      },

      // 畫面狀態控制
      isSubmitting: false,
      showSnackbar: false,
    };
  },
  methods: {
    submitWorkflow() {
      this.isSubmitting = true;
      
      // 模擬發送 API 請求到後端 MES 系統
      setTimeout(() => {
        this.isSubmitting = false;
        this.showSnackbar = true;
        // 成功後重置回到第一步
        this.currentStep = 1;
      }, 1500);
    },
  },
};
</script>