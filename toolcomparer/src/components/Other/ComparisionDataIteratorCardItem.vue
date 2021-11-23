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
        class="align-end"
        :class="{
          'blue--text': sortBy === criteriumKV.value.name,
        }"
      >
        {{ "&nbsp;&nbsp;" + getResultString(result, criteriumKV) }}
    </v-list-item-content>
</v-list-item>
</template>

<script lang="ts">
import { NIL as uuidNIL } from "uuid";

import * as Typ from "../../types/index";

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
  }

});
</script>
