<template>
  <div id="ToolListItem">
    <v-card
      v-bind:style="unsavedChanges ? 'background-color: LavenderBlush' : ''"
    >
      <v-container>
        <v-row>
          <v-col cols="9">
            <ToolCard
              :propTool="ToolKV.value"
              :propModuleState="moduleState"
              :propUnsavedChanges="unsavedChanges"
              @update_Tool="updateTool"
              @save_Tool="saveTool"
              @restore_Tool="restoreTool"
            />
          </v-col>
          <!-- Icons -->
          <v-col cols="1">
            <v-btn class="ma-2" icon @click="btnEdit()">
              <v-icon>
                {{ icons.mdiPencil }}
              </v-icon>
            </v-btn>
          </v-col>
          <v-col cols="1">
            <v-btn class="ma-2" icon @click="btnDelete()">
              <v-icon>
                {{ icons.mdiDelete }}
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts">
console.log("Load ToolListItem.vue");

import { v4 as uuidv4 } from "uuid";
import { NIL as uuidNIL } from "uuid";

import * as Typ from "../../types/index";
import {
  mdiAccount,
  mdiPencil,
  mdiShareVariant,
  mdiDelete,
  mdiAppleKeyboardControl,
} from "@mdi/js";

import Vue from "vue";

import ToolCard from "./ToolCard.vue";

export default Vue.extend({
  name: "ToolListItem",

  components: {
    ToolCard,
  },

  //PROPS
  props: {
    propToolKV: {
      type: Object as () => Typ.toolKeyValue,
    },
    btnText: {
      type: String,
      default: "Add",
    },
  },

  //DATA
  data() {
    return {
      toolKV: JSON.parse(JSON.stringify(this.propToolKV)) as Typ.toolKeyValue,
      moduleState: Typ.toolsModuleState.minimized as Typ.toolsModuleState,

      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
      },

      unsavedChanges: false as boolean,
      resetRequest: false as boolean,

      debug: true as boolean,
    };
  },

  //METHODS
  methods: {
    updateTool(newVal: Typ.tool) {
      this.toolKV.value = newVal;

      if (!this.resetRequest) {
        this.unsavedChanges = true;
      } else {
        this.unsavedChanges = false;
        this.resetRequest = false;
      }
    },
    saveTool(newVal: Typ.tool) {
      this.toolKV.value = newVal;

      this.$store.dispatch("updateTool", this.toolKV);

      this.unsavedChanges = false;
    },
    restoreTool() {
      this.resetRequest = true;
      this.toolKV = JSON.parse(
        JSON.stringify(this.propToolKV)
      ) as Typ.toolKeyValue;
      this.unsavedChanges = false;
    },

    btnEdit() {
      const appendix: string = this.toolKV.key;
      this.navigateTo("/ToolCreation/Update/" + appendix);
    },
    btnDelete() {
      this.$store.commit("removeTool", this.toolKV);
    },

    navigateTo(route: string): void {
      this.$router.push(route);
    },
  },

  //WATCH
  watch: {
    propTool: {
      handler(newVal: Typ.toolKeyValue) {
        this.toolKV = newVal;

        //LOG
        console.log("ToolListItem: propToolKV changed!");
      },
      deep: true,
    },
  },
});
</script>
