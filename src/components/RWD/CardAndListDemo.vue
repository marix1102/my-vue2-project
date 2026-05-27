<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-card elevation="1">
          <v-card-title class="grey lighten-4">系統選單</v-card-title>

          <v-list nav>
            <v-list-item to="/list/basic-form">
              <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
              <v-list-item-content
                ><v-list-item-title
                  >basicForm</v-list-item-title
                ></v-list-item-content
              >
            </v-list-item>

            <v-list-item to="/list/simple-text-field">
              <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
              <v-list-item-content
                ><v-list-item-title
                  >SimpleTextField</v-list-item-title
                ></v-list-item-content
              >
            </v-list-item>

            <v-list-item to="/list/simple-menu">
              <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
              <v-list-item-content
                ><v-list-item-title
                  >SimpleMenu</v-list-item-title
                ></v-list-item-content
              >
            </v-list-item>

            <v-list-item to="/list/simple-date-picker">
              <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
              <v-list-item-content
                ><v-list-item-title
                  >SimpleDatePicker</v-list-item-title
                ></v-list-item-content
              >
            </v-list-item>

            <v-list-item to="/list/simple-table">
              <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
              <v-list-item-content
                ><v-list-item-title
                  >simpleTable</v-list-item-title
                ></v-list-item-content
              >
            </v-list-item>

            <v-list-item to="/list/simple-dialog">
              <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
              <v-list-item-content
                ><v-list-item-title
                  >SimpleDialog</v-list-item-title
                ></v-list-item-content
              >
            </v-list-item>

            <v-list-item to="/list/shopping">
              <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
              <v-list-item-content
                ><v-list-item-title
                  >shopping</v-list-item-title
                ></v-list-item-content
              >
            </v-list-item>

            <v-list-item to="/list/order">
              <v-list-item-icon><v-icon>mdi-cog</v-icon></v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>order</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item to="/list/button-demo">
              <v-list-item-icon><v-icon>mdi-cog</v-icon></v-list-item-icon>
              <v-list-item-content
                ><v-list-item-title
                  >buttonDemo</v-list-item-title
                ></v-list-item-content
              >
            </v-list-item>

            <v-list-item to="/list/wafer-map">
              <v-list-item-icon><v-icon>mdi-cog</v-icon></v-list-item-icon>
              <v-list-item-content
                ><v-list-item-title
                  >WaferMap</v-list-item-title
                ></v-list-item-content
              >
            </v-list-item>

            <v-list-item to="/list/simple-mixin">
              <v-list-item-icon><v-icon>mdi-cog</v-icon></v-list-item-icon>
              <v-list-item-content
                ><v-list-item-title
                  >SimpleMixin</v-list-item-title
                ></v-list-item-content
              >
            </v-list-item>

            <v-list-item to="/list/keep-alive">
              <v-list-item-icon>
                <v-icon>mdi-cog</v-icon>
                </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>SimpleKeepAlive</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item to="/list/event-bus">
              <v-list-item-icon>
                <v-icon>mdi-cog</v-icon>
                </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>SimpleEventBus</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card min-height="300" class="pa-4">
          <router-view />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "CardAndListDemo",
};
</script>