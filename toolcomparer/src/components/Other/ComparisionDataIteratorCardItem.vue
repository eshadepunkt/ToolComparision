<template>
<v-list-item>
    <v-list-item-content
        :class="{
          'blue--text': sortBy === criteriumKV.value.name,
        }"
      >
        {{ criteriumKV.value.name }}:
      </v-list-item-content>
      <v-list-item-content
        :class="{
          'blue--text': sortBy === criteriumKV.value.name,
        }"
      >
        {{ "&nbsp;&nbsp;" + getResultString(result, criteriumKV) }}
    </v-list-item-content>
    <v-list-item-content>
        <v-btn icon @click="btnEdit()">
            <v-icon>
            {{ icons.mdiPencil }}
            </v-icon>
        </v-btn>    
    </v-list-item-content>
</v-list-item>
</template>

<script lang="ts">
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

import ToolListItem from "../Tool/ToolListItem.vue";

export default Vue.extend({
  name: "ComparisionListBox",

  components: {
    ToolListItem,
  },

  props: {
    result: {
      type: Object as () => Typ.toolRating,
    },
    criteriumKV: {
      type: Object as () => Typ.criteriumKeyValue,
    },
    sortBy: {
      type: String,
    },
  },

  //DATA
  data() {
    return {
      uuidNIL,
      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
      },
    };
  },

  methods: {
    getResultString(
      result: Typ.toolRating,
      criteriumKV: Typ.criteriumKeyValue
    ): string {
      const index = result.toolKV.value.criteriaSuitabilities.findIndex(
        (x) => x.criteriumKV.key == criteriumKV.key
      );
      if (index !== -1) {
        const toolCriteriumSuitability: Typ.toolCriteriumSuitability =
          result.toolKV.value.criteriaSuitabilities[index];

        const max: number =
          Math.pow(toolCriteriumSuitability.criteriumKV.value.importance, 2) *
          Typ.toolCriteriumFullfillment.verygood;

        const min: number =
          Math.pow(toolCriteriumSuitability.criteriumKV.value.importance, 2) *
          toolCriteriumSuitability.fullfillment;

        return min + "/" + max;
      }

      return "";
    },

    btnEdit() {
        const index = this.result.toolKV.value.criteriaSuitabilities.findIndex(
        (x) => x.criteriumKV.key == this.criteriumKV.key
        );
        const appendix: string =
            this.result.toolKV.key +
            "/" +
            this.result.toolKV.value.criteriaSuitabilities[index]
            .criteriumKV.key;
        this.navigateTo(
            "/ToolCriteriumSuitabilityCreation/UpdateSingle/" + appendix
        );
    },
    /*
    btnDelete() {
        const index = this.result.toolKV.value.criteriaSuitabilities.findIndex(
        (x) => x.criteriumKV.key == this.criteriumKV.key
        );
        this.$store.commit("removeToolSuitability", {
            toolKV: this.result.toolKV,
            criteriumSuitability:
            this.result.toolKV.value.criteriaSuitabilities[index],
        });
    },
    */

    navigateTo(route: string): void {
      this.$router.push(route);
    },
  }

});
</script>
