<template>
  <v-card>
      <v-toolbar dark color="blue darken-3" class="mb-1">
        <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search tool"
        >
        </v-text-field>
    </v-toolbar>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
              <th>Tools</th>
            <th
                v-on:click="changeSort($event, '')"
            >
                <v-row>
                    <v-col cols="9"
                        v-bind="attrs" v-on="on"
                    >
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
          <ComparisionDataTableRow
            v-for="(result, index) in getFilteredResults"
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
  </v-card>
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

import ComparisionContainer from "./ComparisionContainer.vue";
import ComparisionDataTableHeader from "./ComparisionDataTableHeader.vue";
import ComparisionDataTableRow from "./ComparisionDataTableRow.vue";

export default Vue.extend({
  name: "ComparisionListBox",

  components: {
    ComparisionContainer,
    ComparisionDataTableHeader,
    ComparisionDataTableRow,
  },

  //DATA
  data() {
    return {
      tools: this.$store.getters.getTools as Array<Typ.toolKeyValue>,
      criteria: Array<Typ.criteriumKeyValue>(),

      maxScore: -1 as number,
      uuidNIL,
       icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
        mdiSort,
      },

      search: "",
      filter: {},
      sortDesc: true,
      sortBy: "",
    };
  },

  //METHODS
  methods: {
    navigateTo(route: string): void {
      this.$router.push(route);
    },
    cacheCriteria() {
      const unsorted: Array<Typ.criteriumKeyValue> = JSON.parse(
        JSON.stringify(this.$store.getters.getCriteria)
      );

      this.criteria = unsorted.sort((a, b) => {
        if (a.value.isExclusionCriterium === b.value.isExclusionCriterium) {
          return b.value.importance - a.value.importance;
        } else if (a.value.isExclusionCriterium) {
          return -1;
        } else {
          return 1;
        }
      });
    },

    getRated(toolKV: Typ.toolKeyValue): Typ.toolRating {
      toolKV.value.criteriaSuitabilities =
        this.filterUnusedSuitabilities(toolKV);
      let score: Typ.score = this.getScore(toolKV);

      return {
        toolKV: toolKV,
        score: score,
        rank: -1,
      } as Typ.toolRating;
    },
    hasNoMissingCriteria(toolKV: Typ.toolKeyValue): boolean {
      let toolCriteria: Array<Typ.criteriumKeyValue> =
        toolKV.value.criteriaSuitabilities.map((x) => x.criteriumKV);
      //NOTE: A tool could have stored tools that aren't in usage
      if (toolCriteria.length < this.criteria.length) {
        return false;
      }

      for (let i = 0; i < this.criteria.length; i++) {
        let notFound =
          toolCriteria.findIndex((x) => x.key === this.criteria[i].key) === -1;
        if (notFound) {
          return false;
        }
      }

      return true;
    },
    filterUnusedSuitabilities(
      toolKV: Typ.toolKeyValue
    ): Array<Typ.toolCriteriumSuitability> {
      let toolCriteriumSuitabilites: Array<Typ.toolCriteriumSuitability> =
        toolKV.value.criteriaSuitabilities;

      let filtered = toolCriteriumSuitabilites.filter(
        (x) =>
          this.criteria.findIndex((y) => y.key === x.criteriumKV.key) !== -1
      );

      return filtered;
    },
    getScore(toolKV: Typ.toolKeyValue): Typ.score {
      let currentScore = 0;
      let suitabilities = toolKV.value.criteriaSuitabilities;
      let isExcluded = false;

      suitabilities.forEach((element) => {
        let importance = element.criteriumKV.value.importance;
        let isExclusion = element.criteriumKV.value.isExclusionCriterium;
        let fullfillment = element.fullfillment;

        let score = Math.pow(importance, 2) * fullfillment;
        if (isExclusion && score === 0) {
          isExcluded = true;
        }
        currentScore += score;
      });

      return {
        currentValue: currentScore,
        maxValue: this.maxScore,
        isExcluded: isExcluded,
      } as Typ.score;
    },
    cacheMaxScore() {
      let score = 0;
      this.criteria.forEach((element) => {
        score +=
          Math.pow(element.value.importance, 2) *
          Typ.toolCriteriumFullfillment.verygood;
      });

      this.maxScore = score;
    },

    //NOTE: Sort DESCending
    getSorted(rated: Array<Typ.toolRating>): Array<Typ.toolRating> {
      let sorted = rated.sort((a, b) => {
        if (a.score.isExcluded === b.score.isExcluded) {
          return b.score.currentValue - a.score.currentValue;
        } else if (a.score.isExcluded) {
          return 1;
        } else {
          return -1;
        }
      });

      return sorted;
    },
    //NOTE: Sorted array
    getRanked(rated: Array<Typ.toolRating>): Array<Typ.toolRating> {
      let ranked = rated;
      let rank = 1;
      for (let i = 1; i < ranked.length; i++) {
        if (ranked[i - 1].score.currentValue === ranked[i].score.currentValue) {
          ranked[i - 1].rank = rank;
          ranked[i].rank = rank;
        } else {
          ranked[i - 1].rank = rank;
          ranked[i].rank = ++rank;
        }
      }

      return ranked;
    },

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
        console.log("CS");
        if (this.sortBy == sortBy) {
            this.sortDesc = !this.sortDesc;
        }
        else {
            this.sortBy = sortBy;
        }
    },
    exporter() {
      //TO DO
      //EXPORT
    },
    importer() {
      (this.$refs.uploader as Vue & { click: () => void }).click();
    },
    onFileChanged(e: any) {
      //TO DO
      //IMPORT
    },
    convertJSONToArray(json: string | undefined) {
      //TO DO
      //Convert IMPORT
    },

    stringContains(value: string, searchFor: string): boolean {
      if (searchFor === "" || searchFor === undefined || searchFor === null) {
        return true;
      }

      var v = (value || "").toLowerCase();
      var v2 = searchFor;
      if (v2) {
        v2 = v2.toLowerCase();
      }
      return v.indexOf(v2) !== -1;
    },
  },

  //MOUNTED
  mounted: function () {
    this.cacheCriteria();
    this.cacheMaxScore();
  },

  //COMPUTED
  computed: {
    getResults: function (): Array<Typ.toolRating> {
      const raw = JSON.parse(
        JSON.stringify(this.tools)
      ) as Array<Typ.toolKeyValue>;
      let converted: Array<Typ.toolRating> = Array<Typ.toolRating>();

      raw.forEach((toolKV) => {
        const hasNoMissing = this.hasNoMissingCriteria(toolKV);
        if (hasNoMissing) {
          let rated = this.getRated(toolKV);
          converted.push(rated);
        } else {
          //TO DO
          //REDIRECT AND INFORM
        }
      });

      const sorted = this.getSorted(converted);
      const ranked = this.getRanked(sorted);

      return ranked;
    },
    getFilteredResults: function (): Array<Typ.toolRating> {
      const results = this.getResults;

      const filtered = results.filter((x) =>
        this.stringContains(x.toolKV.value.name, this.search)
      );

      const sortInt = this.sortDesc ? -1 : 1;

      if (this.sortBy !== "") {
        return filtered.sort((a: Typ.toolRating, b: Typ.toolRating) => {
          const aIndex = a.toolKV.value.criteriaSuitabilities.findIndex(
            (x) => x.criteriumKV.value.name === this.sortBy
          );
          const aCriteriumValue =
            aIndex !== -1
              ? a.toolKV.value.criteriaSuitabilities[aIndex].fullfillment
              : -1;

          const bIndex = b.toolKV.value.criteriaSuitabilities.findIndex(
            (x) => x.criteriumKV.value.name === this.sortBy
          );
          const bCriteriumValue =
            aIndex !== -1
              ? b.toolKV.value.criteriaSuitabilities[bIndex].fullfillment
              : -1;

          return (aCriteriumValue - bCriteriumValue) * sortInt;
        });
      } else {
        return filtered.sort((a, b) => {
          if (a.score.isExcluded === b.score.isExcluded) {
            return a.score.currentValue - b.score.currentValue * sortInt;
          } else if (a.score.isExcluded) {
            return -1 * sortInt;
          } else {
            return 1 * sortInt;
          }
        });
      }
    },
  },
});
</script>
