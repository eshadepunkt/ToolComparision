<template>
  <div id="ToolCriteriumSuitabilityListItem">
    <v-card>
      <v-container>
        <v-row>
          <v-col cols="10">
            <ToolCriteriumSuitabilityCard
              :propToolCriteriumSuitability="
                propToolKV.value.criteriaSuitabilities[propSuitabilityIndex]
              "
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
  </div>
</template>

<script lang="ts">
console.log("Load ToolCriteriumSuitabilityListItem.vue");

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

export default Vue.extend({
  name: "ToolCriteriumSuitabilityListItem",

  components: {
    ToolCriteriumSuitabilityCard,
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

      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
      },

      debug: true as boolean,
    };
  },

  //METHODS
  methods: {
    btnEdit() {
      const appendix: string =
        this.propToolKV.key +
        "/" +
        this.propToolKV.value.criteriaSuitabilities[this.propSuitabilityIndex]
          .criteriumKV.key;
      this.navigateTo(
        "/ToolCriteriumSuitabilityCreation/UpdateSingle/" + appendix
      );
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

    navigateTo(route: string): void {
      this.$router.push(route);
    },
  },
});
</script>
