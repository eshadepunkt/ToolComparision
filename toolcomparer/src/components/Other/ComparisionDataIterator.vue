<template>
  <div id="ComparisionDataIterator">
    <v-card min-height="100vh" color="grey lighten-5">
      <v-container fluid>
        <v-data-iterator :items="getFilteredResults" hide-default-footer>
          <template v-slot:header>
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
              <template v-if="$vuetify.breakpoint.mdAndUp">
                <v-spacer></v-spacer>
                <v-select
                  v-model="sortBy"
                  flat
                  solo-inverted
                  hide-details
                  :items="[''].concat(criteria.map((x) => x.value.name))"
                  prepend-inner-icon="mdi-magnify"
                  label="Sort by criteria"
                >
                </v-select>
                <v-spacer></v-spacer>
                <v-btn-toggle v-model="sortDesc" mandatory>
                  <v-btn large depressed color="blue" :value="false">
                    <v-icon>mdi-arrow-up</v-icon>
                  </v-btn>
                  <v-btn large depressed color="blue" :value="true">
                    <v-icon>mdi-arrow-down</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </template>
            </v-toolbar>
          </template>
          <template v-slot:default="props">
            <v-row>
              <v-col
                v-for="result in props.items"
                :key="result.toolKV.key"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <ComparisionDataIteratorCard
                  :result="result"
                  :criteria="criteria"
                  :sortBy="sortBy"
                />
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts">
import { NIL as uuidNIL } from "uuid";

import * as Typ from "../../types/index";

import Vue from "vue";

import ComparisionDataIteratorCard from "./ComparisionDataIteratorCard.vue";

export default Vue.extend({
  name: "ComparisionListBox",

  components: {
    ComparisionDataIteratorCard,
  },

  //DATA
  data() {
    return {
      tools: Array<Typ.toolKeyValue>(),
      criteria: Array<Typ.criteriumKeyValue>(),
      maxScore: -1 as number,
      results: Array<Typ.toolRating>(),
      uuidNIL,

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
    getTools(): Array<Typ.toolKeyValue> {
      this.tools = this.$store.getters.getTools;

      return this.tools;
    },
    cacheCriteria() {
      this.criteria = this.$store.getters.getCriteria;
    },
    cacheResults() {
      const raw = this.getTools();
      let converted: Array<Typ.toolRating> = Array<Typ.toolRating>();

      raw.forEach((tool) => {
        if (this.hasNoMissingCriteria(tool)) {
          let rated = this.getRated(tool);
          converted.push(rated);
        } else {
          //TO DO
          //REDIRECT AND INFORM
        }
      });

      const sorted = this.getSorted(converted);
      this.results = this.getRanked(sorted);
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
  },

  //MOUNTED
  mounted: function () {
    this.tools = this.$store.getters.getTools;
    this.cacheCriteria();
    this.cacheMaxScore();
    this.cacheResults();
  },

  //COMPUTED
  computed: {
    getFilteredResults: function (): Array<Typ.toolRating> {
      const filtered = this.results.filter((x) =>
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
