<template>
  <td id="ComparisionDataTableRowItem">
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on">
          <v-chip
            :style="
              getColor() +
              (result.score.isExcluded
                ? 'color: grey'
                : criteriumKV.value.name === sortBy
                ? 'color: blue;'
                : '')
            "
          >
            {{ getResultString(result, criteriumKV) }}
          </v-chip>
        </div>
      </template>
      <span>
        <v-card-text v-html="getRatingInfo()" />
      </span>
    </v-tooltip>
  </td>
</template>

<script lang="ts">
import { NIL as uuidNIL } from "uuid";

import * as Typ from "../../types/index";

import Vue from "vue";

export default Vue.extend({
  name: "ComparisionDataTableRowItem",

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
      Typ,
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
    getRatingInfo(): string {
      const text =
        "Exclusion Criterium: " +
        this.criteriumKV.value.isExclusionCriterium +
        "<br/>Importance: " +
        Typ.convertImportanceEnumToString(this.criteriumKV.value.importance) +
        "<br/>Fullfillment: " +
        Typ.convertFullfillmentEnumToString(this.suitability.fullfillment) +
        "<br/>Justification:<br/>" +
        this.suitability.justification;

      return text;
    },
    getColor(): string {
      const max: number =
        Math.pow(this.suitability.criteriumKV.value.importance, 2) *
        Typ.toolCriteriumFullfillment.verygood;

      const current: number =
        Math.pow(this.suitability.criteriumKV.value.importance, 2) *
        this.suitability.fullfillment;

      if (!this.$store.getters.getSettingsIsColorChips || this.$store.getters.getSettingsIsColorChipsScoreOnly) {
        return "background-color: white;";
      }
      else if (current === 0) {
        return "background-color: lightgrey;";
      }
      else if (current >= max * 0.8) {
        return "background-color: lightgreen;";
      } else if (current >= max * 0.6) {
        return "background-color: yellow;";
      } else {
        return "background-color: red;";
      }
    },
  },
});
</script>
