<template>
  <div id="ComparisionDataIterator">
    <v-data-iterator :items="results" hide-default-footer>
      <template v-slot:default="props">
        <v-row>
          <v-col v-for="result in props.items" :key="noSecHash(result)">
            <ComparisionDataIteratorCard
              :result="result"
              :criteria="criteria"
              :sortBy="sortBy"
            />
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </div>
</template>

<script lang="ts">
import { NIL as uuidNIL } from "uuid";
import { sha1 as noSecHash } from "object-hash";

import * as Typ from "../../types/index";

import Vue from "vue";

import ComparisionDataIteratorCard from "./ComparisionDataIteratorCard.vue";

export default Vue.extend({
  name: "ComparisionDataIterator",

  components: {
    ComparisionDataIteratorCard,
  },

  props: {
    results: {
      type: Array as () => Array<Typ.toolRating>,
    },
    criteria: {
      type: Array as () => Array<Typ.criteriumKeyValue>,
    },

    maxScore: {
      type: Number,
    },

    search: {
      type: String,
    },
    sortDesc: {
      type: Boolean,
    },
    sortBy: {
      type: String,
    },
  },

  //DATA
  data() {
    return {
      uuidNIL,
      noSecHash,
      Typ,
    };
  },
});
</script>
