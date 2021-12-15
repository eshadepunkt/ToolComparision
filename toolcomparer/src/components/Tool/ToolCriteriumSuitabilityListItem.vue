<template>
  <div id="ToolCriteriumSuitabilityListItem">
    <v-card>
      <v-container>
        <v-row>
          <v-col cols="10">
            <ToolCriteriumSuitabilityCard
              :propToolCriteriumSuitability="suitability"
              :propModuleState="moduleState"
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
    <ToolCriteriumSuitabilityCreationDialog
      :propToolKV="toolKV"
      :mode="mode"
      :showDialog="showDialog"
      :criteria="[].Add(suitability)"
      v-on:closeDialog="saveAndCloseDialog()"
    />
  </div>
</template>

<script lang="ts">
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

import ToolCriteriumSuitabilityCard from "./ToolCriteriumSuitabilityCard.vue";
import ToolCriteriumSuitabilityCreationDialog from "./ToolCriteriumSuitabilityCreationDialog.vue";

export default Vue.extend({
  name: "ToolCriteriumSuitabilityListItem",

  components: {
    ToolCriteriumSuitabilityCard,
    ToolCriteriumSuitabilityCreationDialog,
  },

  //PROPS
  props: {
    propToolKV: {
      type: Object as () => Typ.toolKeyValue,
    },
    propSuitabilityIndex: {
      type: Number,
    },
    btnText: {
      type: String,
      default: "Add",
    },
  },

  //DATA
  data() {
    return {
      moduleState: Typ.simpleModuleState.minimized as Typ.simpleModuleState,
      editMode: Typ.simpleEditMode.UpdateSingle,
      showDialog: false as boolean,
      suitability:
        this.propToolKV.value.criteriaSuitabilities[this.propSuitabilityIndex],

      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
      },
      Typ,
    };
  },

  //METHODS
  methods: {
    btnEdit() {
      this.showDialog = true;
    },
    btnDelete() {
      this.$store.commit("removeToolSuitability", {
        toolKV: this.propToolKV,
        criteriumSuitability:
          this.propToolKV.value.criteriaSuitabilities[
            this.propSuitabilityIndex
          ],
      });
    },
  },
});
</script>
