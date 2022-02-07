<template>
  <div id="Comparision">
    <v-container fluid>
      <v-row>
        <v-col>
          <FilterHeader
            :sortItems="getSortItems"
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
        <v-col>
          <v-card style="height: 60vh; overflow-y: auto">
            <ComparisionManager
              :currentView="currentView"
              :results="getFilteredResults"
              :criteria="getCriteria"
              :maxScore="getMaxScore"
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
        <v-card-actions>
          <v-btn @click="changeView()" color="blue lighten-5">
            Change View
          </v-btn>
        </v-card-actions>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { NIL as uuidNIL } from "uuid";

import * as Typ from "../../types/index";

import Vue from "vue";

import Header from "../Other/Header.vue";
import FilterHeader from "../Other/FilterHeader.vue";
import ComparisionManager from "./ComparisionManager.vue";

export default Vue.extend({
  name: "Comparision",

  components: {
    Header,
    FilterHeader,
    ComparisionManager,
  },

  //DATA
  data() {
    return {
      currentView: "DataIterator" as string,

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
    getRatingPlaceholder(toolKV: Typ.toolKeyValue): Typ.toolRating {
      let placeholder: Typ.toolKeyValue = JSON.parse(JSON.stringify(toolKV));
      let realData: Array<Typ.toolCriteriumSuitability> =
        this.filterUnusedSuitabilities(toolKV);
      placeholder.value.criteriaSuitabilities =
        this.addPlaceholderSuitabilities(realData);

      let score: Typ.score = {
        currentValue: -1,
        maxValue: -1,
        isExcluded: true,
      };

      return {
        toolKV: placeholder,
        score: score,
        rank: -1,
      } as Typ.toolRating;
    },
    hasNoMissingCriteria(toolKV: Typ.toolKeyValue): boolean {
      let toolCriteria: Array<Typ.criteriumKeyValue> =
        toolKV.value.criteriaSuitabilities.map((x) => x.criteriumKV);
      //NOTE: A tool could have stored tools that aren't in usage
      if (toolCriteria.length < this.getCriteria.length) {
        return false;
      }

      for (let i = 0; i < this.getCriteria.length; i++) {
        let notFound =
          toolCriteria.findIndex((x) => x.key === this.getCriteria[i].key) ===
          -1;
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
          this.getCriteria.findIndex((y) => y.key === x.criteriumKV.key) !== -1
      );

      return filtered;
    },
    addPlaceholderSuitabilities(
      realData: Array<Typ.toolCriteriumSuitability>
    ): Array<Typ.toolCriteriumSuitability> {
      let toolCriteriumSuitabilites: Array<Typ.toolCriteriumSuitability> =
        realData;

      let missing = this.getCriteria.filter(
        (x) =>
          toolCriteriumSuitabilites.findIndex(
            (y) => y.criteriumKV.key === x.key
          ) === -1
      );

      missing.forEach((element) => {
        let placeholder: Typ.toolCriteriumSuitability = {
          criteriumKV: element,
          fullfillment: Typ.toolCriteriumFullfillment.undefined,
          justification: "",
        };
        toolCriteriumSuitabilites.push(placeholder);
      });

      return toolCriteriumSuitabilites;
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
        maxValue: this.getMaxScore,
        isExcluded: isExcluded,
      } as Typ.score;
    },

    //NOTE: Sort DESCending
    //Sorts Ratings for Ranking
    getSorted(rated: Array<Typ.toolRating>): Array<Typ.toolRating> {
      let sorted = rated.sort((a, b) => {
        if (a.score.isExcluded === b.score.isExcluded) {
          let result: number = b.score.currentValue - a.score.currentValue;
          return result !== 0
            ? result
            : a.toolKV.value.name.localeCompare(b.toolKV.value.name);
        } else if (a.score.isExcluded) {
          return 1;
        } else {
          return -1;
        }
      });

      return sorted;
    },
    //NOTE: Sort DESCending
    //Sorts Criteria for Importance
    getSortedCriteria(
      unsorted: Array<Typ.criteriumKeyValue>
    ): Array<Typ.criteriumKeyValue> {
      return unsorted.sort((a, b) => {
        if (a.value.isExclusionCriterium === b.value.isExclusionCriterium) {
          let result: number = b.value.importance - a.value.importance;
          return result !== 0
            ? result
            : a.value.name.localeCompare(b.value.name);
        } else if (a.value.isExclusionCriterium) {
          return -1;
        } else {
          return 1;
        }
      });
    },
    //NOTE: Sort DESCending
    //Sorts (Suitability-) Criteria for Importance
    getSortedSuitabilities(
      unsorted: Array<Typ.toolCriteriumSuitability>
    ): Array<Typ.toolCriteriumSuitability> {
      return unsorted.sort((a, b) => {
        if (
          a.criteriumKV.value.isExclusionCriterium ===
          b.criteriumKV.value.isExclusionCriterium
        ) {
          let result: number =
            b.criteriumKV.value.importance - a.criteriumKV.value.importance;
          return result !== 0
            ? result
            : a.criteriumKV.value.name.localeCompare(b.criteriumKV.value.name);
        } else if (a.criteriumKV.value.isExclusionCriterium) {
          return -1;
        } else {
          return 1;
        }
      });
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

  //COMPUTED
  computed: {
    getResults: function (): Array<Typ.toolRating> {
      const raw = JSON.parse(
        JSON.stringify(this.$store.getters.getTools)
      ) as Array<Typ.toolKeyValue>;
      let converted: Array<Typ.toolRating> = Array<Typ.toolRating>();

      raw.forEach((toolKV) => {
        const hasNoMissing = this.hasNoMissingCriteria(toolKV);
        if (hasNoMissing) {
          let rated = this.getRated(toolKV);
          converted.push(rated);
        } else {
          let placeholder = this.getRatingPlaceholder(toolKV);
          converted.push(placeholder);
        }
      });

      const sorted = this.getSorted(converted);
      const ranked = this.getRanked(sorted);

      ranked.forEach((element) => {
        element.toolKV.value.criteriaSuitabilities =
          this.getSortedSuitabilities(
            element.toolKV.value.criteriaSuitabilities
          );
      });

      return ranked;
    },
    getFilteredResults: function (): Array<Typ.toolRating> {
      const results = this.getResults;

      const filtered = results.filter((x) =>
        Typ.stringContains(x.toolKV.value.name, this.search)
      );

      const sortInt = this.sortDesc ? -1 : 1;

      if (this.sortBy !== "") {
        return filtered.sort((a: Typ.toolRating, b: Typ.toolRating) => {
          if (this.sortBy === "tool-name") {
            return a.toolKV.value.name.localeCompare(b.toolKV.value.name) * sortInt;
          }

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
    getCriteria: function (): Array<Typ.criteriumKeyValue> {
      const unsorted: Array<Typ.criteriumKeyValue> = JSON.parse(
        JSON.stringify(this.$store.getters.getCriteria)
      );

      const sorted: Array<Typ.criteriumKeyValue> =
        this.getSortedCriteria(unsorted);

      return sorted;
    },
    getMaxScore: function (): number {
      let score = 0;
      const criteria: Array<Typ.criteriumKeyValue> =
        this.$store.getters.getCriteria;
      criteria.forEach((element) => {
        score +=
          Math.pow(element.value.importance, 2) *
          Typ.toolCriteriumFullfillment.verygood;
      });

      return score;
    },
    getSortItems: function(): Array<Typ.ISortItem> {
      return [{
        key: "tool-name",
        value: {
          name: "tool-name"
        }
      }].concat(this.getCriteria);
    }
  },
});
</script>
