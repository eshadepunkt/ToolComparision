<template>
<v-list-item>
    <v-list-item-content
        :class="{
          'blue--text': sortBy === criteriumKV.value.name,
        }"
      >
      <v-tooltip>
          {{ criteriumKV.value.name }}:
          <span>
              {{  }}
          </span>
      </v-tooltip>    
      </v-list-item-content>
      <v-list-item-content
        :class="{
          'blue--text': sortBy === criteriumKV.value.name,
        }"
      >
        {{ "&nbsp;&nbsp;" + getResultString() }}
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
    propSuitabilityIndex: {
      type: Number,
    },
    sortBy: {
      type: String,
    },
  },

  //DATA
  data() {
    return {
        criteriumKV: this.result.toolKV.value.criteriaSuitabilities[this.propSuitabilityIndex].criteriumKV as Typ.criteriumKeyValue,
        suitability: this.result.toolKV.value.criteriaSuitabilities[this.propSuitabilityIndex] as Typ.toolCriteriumSuitability,
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
    getResultString(): string {
        const max: number =
          Math.pow(this.suitability.criteriumKV.value.importance, 2) *
          Typ.toolCriteriumFullfillment.verygood;

        const min: number =
          Math.pow(this.suitability.criteriumKV.value.importance, 2) *
          this.suitability.fullfillment;

        return min + "/" + max;
    },
    getCriteriumInfo(): string {
        const text =
            "Description:\n" + this.criteriumKV.value.description +
            "\nImportance:\n" + Typ.convertImportanceEnumToString(this.criteriumKV.value.importance) +
            "\Fullfillment:\n" + Typ.convertFullfillmentEnumToString(this.suitability.fullfillment) + 
            "\nJustification:\n" + this.suitability.justification;

        return text;
    },

    btnEdit() {
        const appendix: string =
            this.result.toolKV.key +
            "/" +
            this.suitability.criteriumKV.key;
        this.navigateTo(
            "/ToolCriteriumSuitabilityCreation/UpdateSingle/" + appendix
        );
    },

    navigateTo(route: string): void {
      this.$router.push(route);
    },
  }

});
</script>
