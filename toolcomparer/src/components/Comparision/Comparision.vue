<template>
  <div id="Comparision">
    <v-container>
      <v-row>
        <v-col xl="12">
          <ComparisionHeader
            :sortItems="criteria"
            :search="search"
            :sortDesc="sortDesc"
            :sortBy="sortBy"
            v-on:searchChanged="searchChanged"
            v-on:sortDescChanged="sortDescChanged"
            v-on:sortByChanged="sortByChanged"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col xl="12">
          <v-card style="height: 59vh; overflow-y: auto">
            <ComparisionManager
              :currentView="currentView"
              :results="getFilteredResults"
              :criteria="criteria"
              :maxScore="maxScore"
              :search="search"
              :sortDesc="sortDesc"
              :sortBy="sortBy"
              v-on:sortDescChanged="sortDescChanged"
              v-on:sortByChanged="sortByChanged"
            />
          </v-card>
        </v-col>
      </v-row>
      <!-- Buttons -->
      <v-row
        align="center"
        align-content="space-between"
        justify="space-between"
      >
        <v-col xl="1">
          <v-btn @click="changeView()" color="blue lighten-5">
            Change View
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { NIL as uuidNIL } from "uuid";

import * as Typ from "../../types/index";

import Vue from "vue";

import Header from "../Other/Header.vue";
import ComparisionHeader from "./ComparisionHeader.vue";
import ComparisionManager from "./ComparisionManager.vue";

export default Vue.extend({
  name: "Comparision",

  components: {
    Header,
    ComparisionHeader,
    ComparisionManager,
  },

  //DATA
  data() {
    return {
      currentView: "DataIterator" as string,
      tools: this.$store.getters.getTools as Array<Typ.toolKeyValue>,
      criteria: Array<Typ.criteriumKeyValue>(),

      maxScore: -1 as number,
      uuidNIL,
      Typ,

      search: "",
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

    searchChanged(val: string) {
      this.search = val;
    },
    sortDescChanged(val: boolean) {
      this.sortDesc = val;
    },
    sortByChanged(val: string) {
      this.sortBy = val;
    },
    changeView() {
      const isTableView: boolean = this.currentView === "DataTable";
      this.currentView = isTableView ? "DataIterator" : "DataTable";
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
