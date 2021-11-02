<template>

<div id="App" style="background-color: #FAFAFA">
  <v-app>
    <v-card
      color="grey lighten-5">

      <CriteriumListBox v-if="isCurrent('criteria')" @change_app_state="changeCurrentState" />
      <CriteriumCreation v-if="isCurrent('criteriumCreation')" @change_app_state="changeCurrentState" />

    </v-card>    
  </v-app>
</div>
  
</template>

<script lang="ts">
console.log("Load App.vue");
console.dir();


import * as Typ from "./types/index";
import {
    mdiAccount,
    mdiPencil,
    mdiShareVariant,
    mdiDelete,
    mdiAppleKeyboardControl,
  } from '@mdi/js';

import Vue from 'vue';

import CriteriumCard from "./components/CriteriumCard.vue";
import CriteriumCreation from "./components/CriteriumCreation.vue";
import CriteriumListBox from "./components/CriteriumListBox.vue";

export default Vue.extend({
  name: "App",

  components: {
    CriteriumCard,
    CriteriumCreation,
    CriteriumListBox,
  },

  data: () => ({
    currentState: Typ.appState.criteria as Typ.appState,
  }),

  methods: {
    changeCurrentState(state: string) : void {
        //Log
        console.log("App: change current state from '" + 
        Typ.appState[this.currentState] + "' to: '" + state + "'");

        this.currentState = this.convertStringToAppStateEnum(state);
    },

    isCurrent(sender: string) : boolean {
        //Log
        console.log("App: request current state from '" + 
            sender + "'; current: '" + Typ.appState[this.currentState] + "'");

        var senderEnum: Typ.appState = this.convertStringToAppStateEnum(sender);
        

        return senderEnum === this.currentState;
    },
    convertStringToAppStateEnum(convert: string) : Typ.appState { 
        //Log 
        console.log("App: convert string '" + 
            convert + "' to appState");
        
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
});
</script>
