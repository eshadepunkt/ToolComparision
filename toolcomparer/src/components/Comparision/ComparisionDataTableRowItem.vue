<template>
  <td id="ComparisionDataTableRowItem">
    <div>
          <v-chip v-on:click="btnEdit()"      
            :style="
              getColor() +
              (result.score.isExcluded 
                || suitability.fullfillment === Typ.toolCriteriumFullfillment.undefined
                ? 'color: grey:'
                : criteriumKV.value.name === sortBy
                ? 'color: blue;'
                : '')
            "
          >
          <div style="width: 4.5em;">
          <div v-if="
              suitability.fullfillment !==
              Typ.toolCriteriumFullfillment.undefined
            ">
            <div v-if="!$store.getters.getSettingsIsStarsInsteadOfNumbers">
              {{ getResultString(result, criteriumKV) }}
            </div>
            <div v-else-if="$store.getters.getSettingsIsStarsInsteadOfNumbers">
              <v-rating
                :empty-icon="icons.mdiStarOutline"
                :full-icon="icons.mdiStar"
                :half-icon="icons.mdiStarHalfFull"
                :value="getRatingRatio()"
                half-increments
                readonly
                dense
                x-small
                length="5"
                size="1.5em"
              >
              </v-rating>
            </div>
          </div>
          </div>
          </v-chip>
        </div>
    <ToolCriteriumSuitabilityCreationDialog
        :propToolKV="result.toolKV"
        :mode="editMode"
        :showDialog="showDialog"
        :criteria="[].concat(suitability.criteriumKV)"
        v-on:closeDialog="showDialog = false"
      />
  </td>
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
  mdiStar,
  mdiStarOutline,
  mdiStarHalfFull,
} from "@mdi/js";

import Vue from "vue";

import ToolCriteriumSuitabilityCreationDialog from "../Tool/ToolCriteriumSuitabilityCreationDialog.vue";

export default Vue.extend({
  name: "ComparisionDataTableRowItem",

  components: {
    ToolCriteriumSuitabilityCreationDialog,
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
      criteriumKV: this.result.toolKV.value.criteriaSuitabilities[
        this.propSuitabilityIndex
      ].criteriumKV as Typ.criteriumKeyValue,
      suitability: this.result.toolKV.value.criteriaSuitabilities[
        this.propSuitabilityIndex
      ] as Typ.toolCriteriumSuitability,

      showDialog: false as boolean,
      editMode: Typ.simpleEditMode.UpdateSingle,

      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
        mdiStar,
        mdiStarOutline,
        mdiStarHalfFull,
      },
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
    getRatingRatio(): number {
      const max: number =
        Math.pow(this.suitability.criteriumKV.value.importance, 2) *
        Typ.toolCriteriumFullfillment.verygood;

      const min: number =
        Math.pow(this.suitability.criteriumKV.value.importance, 2) *
        this.suitability.fullfillment;

      return (min / max) * 5;
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

      if (
        !this.$store.getters.getSettingsIsColorChips ||
        this.$store.getters.getSettingsIsColorChipsScoreOnly
      ) {
        return "background-color: white;";
      } else if (current === 0) {
        return "background-color: lightgrey;";
      } else if (current >= max * 0.8) {
        return "background-color: lightgreen;";
      } else if (current >= max * 0.6) {
        return "background-color: yellow;";
      } else {
        return "background-color: red;";
      }
    },

     btnEdit() {
      this.showDialog = true;
    },
  },
});
</script>
