<template>
  <div id="ComparisionListBox">
    <v-card min-height="100vh" color="grey lighten-5">
      <v-container>
        <!-- Head -->
        <v-row>
          <v-col xl="12">
            <v-card color="indigo darken-4">
              <h1 style="text-align: center; color: white">Comparision</h1>
            </v-card>
          </v-col>
        </v-row>

        <!-- Body -->
        <v-row>
          <v-col xl="12">
            <v-list style="height: 72vh; overflow-y: auto">
              <v-item-group>
                <v-item v-for="result in results" :key="result.tool.key">
                  <ToolListItem
                    :propToolKV="result.tool"
                    :propToolRating="result"
                  />
                </v-item>
              </v-item-group>
            </v-list>
          </v-col>
        </v-row>

        <!-- Buttons -->
        <v-row
          align="center"
          align-content="space-between"
          justify="space-between"
        >
          <v-col xl="1">
            <v-btn @click="navigateTo('/Tools/')" color="red lighten-5">
              Change Tools
            </v-btn>
          </v-col>
        </v-row>
        <v-row
          align="center"
          align-content="space-between"
          justify="space-between"
        >
          <v-col xl="1">
            <v-btn @click="importer()"> Import </v-btn>
            <input
              ref="uploader"
              class="d-none"
              type="file"
              accept=".json"
              @change="onFileChanged"
            />
          </v-col>
          <v-col xl="1">
            <v-btn @click="exporter()"> Export </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts">
console.log("Load ComparisionListBox.vue");

import { v4 as uuidv4 } from "uuid";
import { NIL as uuidNIL } from "uuid";

import * as Typ from "../../types/index";
import {
  mdiAccount,
  mdiPencil,
  mdiShareVariant,
  mdiDelete,
  mdiAppleKeyboardControl,
} from "@mdi/js";

import Vue from "vue";

import ToolListItem from "../Tool/ToolListItem.vue";
import { filter } from "vue/types/umd";

export default Vue.extend({
  name: "ComparisionListBox",

  components: {
    ToolListItem,
  },

  //DATA
  data() {
    return {
      tools: {} as Array<Typ.toolKeyValue>,
      criteria: {} as Array<Typ.criteriumKeyValue>,
      maxScore: -1 as number,
      results: {} as Array<Typ.toolRating>,
      uuidNIL,
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
    getRated(tool: Typ.toolKeyValue): Typ.toolRating {
      tool.value.criteriaSuitabilities = this.filterUnusedSuitabilities(tool);
      let score: Typ.score = this.getScore(tool);

      return {
        tool: tool,
        score: score,
        rank: -1,
      } as Typ.toolRating;
    },
    hasNoMissingCriteria(tool: Typ.toolKeyValue): boolean {
      let toolCriteria: Array<Typ.criteriumKeyValue> =
        tool.value.criteriaSuitabilities.map((x) => x.criteriumKV);
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
      tool: Typ.toolKeyValue
    ): Array<Typ.toolCriteriumSuitability> {
      let toolCriteriumSuitabilites: Array<Typ.toolCriteriumSuitability> =
        tool.value.criteriaSuitabilities;

      let filtered = toolCriteriumSuitabilites.filter(
        (x) =>
          this.criteria.findIndex((y) => y.key === x.criteriumKV.key) !== -1
      );

      return filtered;
    },
    getScore(tool: Typ.toolKeyValue): Typ.score {
      let currentScore = 0;
      let suitabilities = tool.value.criteriaSuitabilities;
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
    exporter() {
      //TO DO
      //EXPORT
    },
    importer() {
      (this.$refs.uploader as Vue & { click: () => void }).click();
    },
    onFileChanged(e: any) {
      const file = e.target.files[0];
      let reader = new FileReader();
      let json: string | undefined;
      reader.onload = function () {
        json = reader.result?.toString();

        //LOG
        console.log(json);

        e.target.value = null;
      };
      reader.onloadend = () => this.convertJSONToArray(json);
      reader.readAsText(file);
    },
    convertJSONToArray(json: string | undefined) {
      if (json !== undefined) {
        const tmpTools: Array<Typ.toolKeyValue> = JSON.parse(
          json
        ) as Array<Typ.toolKeyValue>;
        this.$store.dispatch("extendTools", tmpTools);
      }
    },
  },

  //MOUNTED
  mounted: function () {
    this.tools = this.$store.getters.getTools;
    this.cacheCriteria();
    this.cacheMaxScore();
    this.cacheResults();

    //LOG
    console.log("ToolCreation: Mounted");
  },
});
</script>
