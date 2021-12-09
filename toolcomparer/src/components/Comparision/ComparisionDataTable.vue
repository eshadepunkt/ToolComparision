<template>
  <div id="ComparisionDataTable">
    <v-simple-table>
        <template>
          <thead>
            <tr>
              <th>
                Tools
              </th>
              <th v-on:click="changeSort($event, '')">
                <v-row>
                  <v-col cols="9">
                    Score
                  </v-col>
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
                :key="criteriumKV.key"
                :criteriumKV="criteriumKV"
                :sortBy="sortBy"
                :sortDesc="sortDesc"
                v-on:click.native="changeSort($event, criteriumKV.value.name)"
              />
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <div v-if="results.lenght === 0">
              No data available
            </div>
            <ComparisionDataTableRow
              v-for="(result, index) in results"
              :key="result.toolKV.key"
              :result="result"
              :propSuitabilityIndex="index"
              :sortBy="sortBy"
              :criteria="criteria"
              class="text-left"
              :style="getColor(result.score)"
            />
          </tbody>
        </template>
      </v-simple-table>
  </div>
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
         return Array<Typ.toolRating>();
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
      sortDesc:  {
        type: Boolean,
      },
      sortBy:  {
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
      },
    };
  },

  methods: {
    getColor(score: Typ.score): string {
      if (score.isExcluded) {
        return "background-color: grey;";
      } else if (score.currentValue >= score.maxValue * 0.8) {
        return "background-color: lightgreen;";
      } else if (score.currentValue >= score.maxValue * 0.6) {
        return "background-color: yellow;";
      } else {
        return "background-color: orange;";
      }
    },
    changeSort(event: any, sortBy: string) {
      if (this.sortBy == sortBy) {
        this.$emit('sortDescChanged', !sortBy);
      } else {
        this.$emit('sortByChanged', sortBy);
      }
    },
  }
});
</script>
