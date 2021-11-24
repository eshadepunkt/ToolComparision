<template>
<v-card>
  <v-card-title class="subheading font-weight-bold">
    {{ result.toolKV.value.name }}
    <br/>
    {{ result.score.currentValue + "/" + result.score.maxValue }}
  </v-card-title>

  <v-divider></v-divider>

  <v-list dense>
    <ComparisionDataIteratorCardItem v-for="(suitability, index) in result.toolKV.value.criteriaSuitabilities"
      :result="result"
      :propSuitabilityIndex="index"
      :sortBy="sortBy"
      :key="suitability.criteriumKV.key"
    />
  </v-list>
</v-card>
</template>

<script lang="ts">
import { NIL as uuidNIL } from "uuid";

import * as Typ from "../../types/index";

import Vue from "vue";

import ComparisionDataIteratorCardItem from "./ComparisionDataIteratorCardItem.vue";

export default Vue.extend({
  name: "ComparisionListBox",

  components: {
    ComparisionDataIteratorCardItem,
  },

  props: {
    result: {
      type: Object as () => Typ.toolRating,
    },
    criteria: {
      type: Object as () => Array<Typ.criteriumKeyValue>,
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
});
</script>

