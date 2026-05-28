<template>
    <v-container class="py-8" style="max-width: 600px;">

        <v-card class="pa-4 mb-4" elevation="2">
            <v-card-title class="headline font-weight-bold primary--text">
                Vue Virtual Scroller 效能實測
            </v-card-title>
            <v-card-text>
                當前陣列內包含 <strong>{{ hugeList.length.toLocaleString() }}</strong> 筆大數據。
            </v-card-text>
        </v-card>

        <recycle-scroller class="scroller grey lighten-4" :items="hugeList" :item-size="60" key-field="id"
            v-slot="{ item }">
            <v-list-item :key="item.id" class="white mb-1 border-bottom" style="height: 60px;">
                <v-list-item-avatar color="primary lighten-4" class="primary--text font-weight-bold justify-center">
                    {{ item.index }}
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title class="font-weight-bold text-truncate">
                        {{ item.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="grey--text">
                        UUID: {{ item.uuid }}
                    </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                    <v-chip small color="success" outlined>正常</v-chip>
                </v-list-item-action>
            </v-list-item>
        </recycle-scroller>

    </v-container>
</template>

<script>
    export default {
        name: 'SimpleVirtualScroller',
        data() {
            return {
                hugeList: [] // 準備用來塞 10 萬筆資料的陣列
            };
        },
        created() {
            // 元件建立時，一口氣倒進 10 萬筆假資料
            console.time('【計時器】產生十萬筆資料耗時');
            const items = [];
            for (let i = 1; i <= 100000; i++) {
                items.push({
                    id: `id-${i}`, // 必備：每筆資料必須有唯一的 key
                    index: i,
                    title: `晶圓批號 WAFER-BATCH-#${String(i).padStart(6, '0')}`,
                    uuid: Math.random().toString(36).substring(2, 15)
                });
            }
            this.hugeList = items;
            console.timeEnd('【計時器】產生十萬筆資料耗時');
        }
    };
</script>

<style scoped>
    /* 💡 Scroller 必備樣式：一定要給定明確高度與設定 overflow-y */
    .scroller {
        height: 500px;
        overflow-y: auto;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 4px;
    }

    .border-bottom {
        border-bottom: 1px solid #f0f0f0 !important;
    }
</style>