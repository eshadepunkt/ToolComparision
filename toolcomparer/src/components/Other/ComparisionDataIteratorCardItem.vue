<template>
  <v-list-item>
    <v-list-item-content>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <div 
            v-bind:style="(criteriumKV.value.name === sortBy) ? 'color: blue;' : ''"
            v-bind="attrs" v-on="on"
          >
            {{ criteriumKV.value.name }}:
          </div>
        </template>
        <span>
          <v-card-text v-html="getCriteriumInfo()" />
        </span>
      </v-tooltip>
    </v-list-item-content>
    <v-list-item-content>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <div
            v-bind:style="(criteriumKV.value.name === sortBy) ? 'color: blue;' : ''"
            v-bind="attrs" v-on="on">
            <v-card-text v-html="getResultString()" />
          </div>
        </template>
        <span>
          <v-card-text v-html="getRatingInfo()" />
        </span>
      </v-tooltip>
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

export default Vue.extend({
  name: "ComparisionListBox",

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
      criteriumKV: this.result.toolKV.value.criteriaSuitabilities[
        this.propSuitabilityIndex
      ].criteriumKV as Typ.criteriumKeyValue,
      suitability: this.result.toolKV.value.criteriaSuitabilities[
        this.propSuitabilityIndex
      ] as Typ.toolCriteriumSuitability,
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
      const text = "Description:<br/>" + this.criteriumKV.value.description;

      return text;
    },
    getRatingInfo(): string {
      const text =
        "Importance: " +
        Typ.convertImportanceEnumToString(this.criteriumKV.value.importance) +
        "<br/>Fullfillment: " +
        Typ.convertFullfillmentEnumToString(this.suitability.fullfillment) +
        "<br/>Justification:<br/>" +
        this.suitability.justification;

      return text;
    },

    btnEdit() {
      const appendix: string =
        this.result.toolKV.key + "/" + this.suitability.criteriumKV.key;
      this.navigateTo(
        "/ToolCriteriumSuitabilityCreation/UpdateSingle/" + appendix
      );
    },

    navigateTo(route: string): void {
      this.$router.push(route);
    },
  },
});
</script>
