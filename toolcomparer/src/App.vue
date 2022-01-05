<template>
  <div id="App" style="background-color: #fafafa">
    <v-app>
      <v-card color="grey lighten-5">
        <router-view />
      </v-card>
    </v-app>
  </div>
</template>

<script lang="ts">
import * as Typ from "./types/index";
import {
  mdiAccount,
  mdiPencil,
  mdiShareVariant,
  mdiDelete,
  mdiAppleKeyboardControl,
} from "@mdi/js";

import Vue from "vue";

export default Vue.extend({
  name: "App",

  data: () => ({
    currentState: Typ.appState.criteria as Typ.appState,
  }),

  methods: {
    changeCurrentState(state: string): void {
      this.currentState = this.convertStringToAppStateEnum(state);
    },

    isCurrent(sender: string): boolean {
      var senderEnum: Typ.appState = this.convertStringToAppStateEnum(sender);

      return senderEnum === this.currentState;
    },
    convertStringToAppStateEnum(convert: string): Typ.appState {
      switch (convert) {
        case "criteria":
          return Typ.appState.criteria;
        case "createCriterium":
          return Typ.appState.criteriumCreation;
        case "tools":
          return Typ.appState.tools;
        case "createTool":
          return Typ.appState.toolCreation;
        case "compare":
          return Typ.appState.compare;
        case "export":
          return Typ.appState.export;
        default:
          return Typ.appState.start;
      }
    },
  },

  //MOUNTED
  mounted: function () {
    this.$router.push("/Start/");
  },
});
</script>
