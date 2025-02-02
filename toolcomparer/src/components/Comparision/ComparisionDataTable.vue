<template>
  <div id="ComparisionDataTable">
    <div v-if="!results || results.length == 0">No data available</div>
    <v-simple-table v-else>
      <template>
        <thead>
          <tr>
            <th v-on:click="changeSort('tool-name')">
              <v-row>
                <v-col cols="9"> Tools </v-col>
                <v-col cols="1">
                  <v-icon
                    v-if="'tool-name' === sortBy"
                    class="ma-2"
                    v-bind:style="sortDesc ? 'transform: scaleY(-1);' : ''"
                    icon
                  >
                    {{ icons.mdiSort }}
                  </v-icon>
                </v-col>
              </v-row>
            </th>
            <th v-on:click="changeSort('')">
              <v-row>
                <v-col cols="9"> Score </v-col>
                <v-col cols="1">
                  <v-icon
                    v-if="'' === sortBy"
                    class="ma-2"
                    v-bind:style="sortDesc ? 'transform: scaleY(-1);' : ''"
                    icon
                  >
                    {{ icons.mdiSort }}
                  </v-icon>
                </v-col>
              </v-row>
            </th>

            <ComparisionDataTableHeader
              v-for="criteriumKV in criteria"
              :key="noSecHash(criteriumKV)"
              :criteriumKV="criteriumKV"
              :sortBy="sortBy"
              :sortDesc="sortDesc"
              v-on:click.native="changeSort(criteriumKV.value.name)"
            />
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <ComparisionDataTableRow
            v-for="(result, index) in results"
            :key="noSecHash(result)"
            :result="result"
            :propSuitabilityIndex="index"
            :sortBy="sortBy"
            :criteria="criteria"
            class="text-left"
            :style="result.score.isExcluded ? 'color: grey;' : ''"
          />
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script lang="ts">
import { NIL as uuidNIL } from "uuid";
import { sha1 as noSecHash } from "object-hash";

import * as Typ from "../../types/index";
import {
  mdiAccount,
  mdiPencil,
  mdiShareVariant,
  mdiDelete,
  mdiAppleKeyboardControl,
  mdiSort,
} from "@mdi/js";

import Vue from "vue";

import ComparisionDataTableHeader from "./ComparisionDataTableHeader.vue";
import ComparisionDataTableRow from "./ComparisionDataTableRow.vue";

export default Vue.extend({
  name: "ComparisionDataTable",

  components: {
    ComparisionDataTableHeader,
    ComparisionDataTableRow,
  },

  props: {
    results: {
      type: Array as () => Array<Typ.toolRating>,
      default() {
        return new Array<Typ.toolRating>();
      },
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
      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
        mdiSort,
      },
      noSecHash,
      Typ,
    };
  },

  methods: {
    changeSort(sortBy: string) {
      if (this.sortBy === sortBy) {
        this.$emit("sortDescChanged", !this.sortDesc);
      } else {
        this.$emit("sortByChanged", sortBy);
      }
    },
  },
});
</script>
