<template>
  <div id="Navigation">
    <v-card
      style="position: relative; height: 100vh; width: 100vw"
      class="overflow-hidden"
      color="grey lighten-5"
    >
      <v-container fluid>
        <!-- Head -->
        <v-row>
          <v-col style="position: absolute; width: 100vw">
            <v-toolbar
              flat
              dense
              tile
              floating
              absolute
              color="transparent"
              style="position: absolute; top: 10px; right: 10px"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    x-small
                    text
                    color="white"
                    v-on:click.native="showBrainstorming = true"
                  >
                    Brainstorming
                  </v-btn>
                </template>
                <span>
                  Starts a Worklow where criteria and tools can be created and
                  combined.
                  <br />
                  Under Settings you can change the Workflow and
                  Validation-Rules.
                </span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    x-small
                    text
                    color="white"
                    v-on:click.native="currentPage = 'Criteria'"
                  >
                    Criteria
                  </v-btn>
                </template>
                <span> Add or change criteria. </span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    x-small
                    text
                    color="white"
                    v-on:click.native="currentPage = 'Tools'"
                  >
                    Tools
                  </v-btn>
                </template>
                <span> Add or change tools. </span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    x-small
                    text
                    color="white"
                    v-on:click.native="currentPage = 'Comparision'"
                  >
                    Comparision
                  </v-btn>
                </template>
                <span>
                  Show Comparision of Tools.
                  <br />
                  Under "Change View" you can switch between card and table
                  design.
                </span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    class="px-2"
                    x-small
                    icon
                    color="white"
                    @click="importer()"
                  >
                    <v-icon>{{ icons.mdiImport }}</v-icon>
                    <input
                      ref="uploader"
                      class="d-none"
                      type="file"
                      :accept="'.json'"
                      @change="onFileChanged"
                    />
                  </v-btn>
                </template>
                <span> Import </span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    class="px-2"
                    x-small
                    icon
                    color="white"
                    v-on:click.native="exportDialog = true"
                  >
                    <v-icon>{{ icons.mdiExport }}</v-icon>
                  </v-btn>
                </template>
                <span> Export </span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    class="px-2"
                    x-small
                    icon
                    color="white"
                    v-on:click.native="showSettings = true"
                  >
                    <v-icon>{{ icons.mdiCog }}</v-icon>
                  </v-btn>
                </template>
                <span>
                  Settings.
                  <br />
                  You can change Workflow, Validation-Rules and
                  Comparision-Design.
                </span>
              </v-tooltip>
            </v-toolbar>
            <Header :headerText="currentPage" />
          </v-col>
        </v-row>

        <!-- Body -->
        <v-row style="position: absolute; left: 1vw; top: 50px; width: 98vw">
          <v-col>
              <NavigationManager
                :criteria="getCriteria"
                :tools="getTools"
                :currentPage="currentPage"
                :workflow="$store.getters.getSettingsWorkflow"
              />
          </v-col>    
        </v-row>
      </v-container>
    </v-card>
    <SettingsDialog
      :showSettings="showSettings"
      v-on:closeSettings="showSettings = false"
    />
    <v-dialog
      v-model="exportDialog"
      height="200px"
      width="275px"
      persistent
      transition="dialog-bottom-transition"
      :retain-focus="false"
      id="ExportDialog"
    >
      <v-card class="overflow-hidden" style="height: 200px; position: relative">
        <v-btn
          style="position: absolute; right: 1em; top: 0em"
          icon
          @click="exportDialog = false"
        >
          <v-icon>{{ icons.mdiClose }}</v-icon>
        </v-btn>
        <v-container
          fluid
          style="position: absolute; left: 1em; top: 1.5em; width: 200px"
        >
          <v-row>
            <v-radio-group v-model="radExportGroup">
              <v-radio
                :key="0"
                :label="'Export Tools & Criteria as JSON'"
                :value="0"
              ></v-radio>
              <v-radio
                :key="1"
                :label="'Export Result as CSV'"
                :value="1"
              ></v-radio>
            </v-radio-group>
          </v-row>
        </v-container>
        <v-row style="position: absolute; bottom: 10px; right: 10px">
          <div class="grow" />
          <v-card-actions>
            <v-btn @click="exporter()" color="primary"> Export </v-btn>
          </v-card-actions>
        </v-row>
      </v-card>
    </v-dialog>
    <Workflow
      :showBrainstorming="showBrainstorming"
      :workflow="$store.getters.getSettingsWorkflow"
      v-on:closeBrainstorming="showBrainstorming = false"
    />
  </div>
</template>

<script lang="ts">
import { v4 as uuidv4 } from "uuid";
import { NIL as uuidNIL } from "uuid";

import * as Typ from "../../types/index";
import {
  mdiAccount,
  mdiPencil,
  mdiShareVariant,
  mdiDelete,
  mdiAppleKeyboardControl,
  mdiCog,
  mdiMenu,
  mdiHome,
  mdiPlus,
  mdiDotsHorizontal,
  mdiVectorCombine,
  mdiSwapVertical,
  mdiImport,
  mdiExport,
  mdiClose,
} from "@mdi/js";

import Vue from "vue";

import Header from "./Header.vue";
import NavigationManager from "./NavigationManager.vue";
import SettingsDialog from "./SettingsDialog.vue";
import FeaturesDialog from "./FeaturesDialog.vue";
import Workflow from "./Workflow.vue";

import * as CSVHandler from "../../js/CSVHandler";

export default Vue.extend({
  name: "Navigation",

  components: {
    Header,
    NavigationManager,
    SettingsDialog,
    FeaturesDialog,
    Workflow,
  },

  //DATA
  data() {
    return {
      showDialog: false as boolean,
      showSettings: false as boolean,
      featuresDialog: false as boolean,
      exportDialog: false as boolean,
      importDialog: false as boolean,
      showBrainstorming: false as boolean,
      currentPage: "Comparision" as string,

      radExportGroup: 0,

      btnBackTxt: "" as string,
      btnNextTxt: "" as string,
      btnAddTxt: "" as string,
      btnAddNavi: "" as string,

      isInitialized: false as boolean,

      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
        mdiCog,
        mdiMenu,
        mdiHome,
        mdiPlus,
        mdiDotsHorizontal,
        mdiVectorCombine,
        mdiSwapVertical,
        mdiImport,
        mdiExport,
        mdiClose,
      },
      uuidNIL,
      Typ,
    };
  },

  //METHODS
  methods: {
    navigateTo(route: string): void {
      this.$router.push(route);
    },
    exporter() {
      let file = "";
      let filename = "";
      switch (this.radExportGroup) {
        case 0:
          {
            file = JSON.stringify(this.$store.getters.getTools);
            filename = "toolcomparer_results.json";
          }
          break;
        case 1:
          {
            file = this.getCSV;
            filename = "toolcomparer_results.csv";
          }
          break;
      }

      let element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(file)
      );
      element.setAttribute("download", filename);

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    importer() {
      (this.$refs.uploader as Vue & { click: () => void }).click();
    },
    onFileChanged(e: any) {
      const file = e.target.files[0];
      if (e.target.value !== null) {
        let reader = new FileReader();
        let txt: string | undefined;
        reader.onload = function () {
          txt = reader.result?.toString();
          e.target.value = null;
        };
        reader.onloadend = () => this.convertJSONToArray(txt);
        reader.readAsText(file);
      }
    },
    convertJSONToArray(txt: string | undefined) {
      if (txt !== undefined) {
        const tmpTools: Array<Typ.toolKeyValue> = JSON.parse(
          txt
        ) as Array<Typ.toolKeyValue>;
        this.$store.dispatch("extendTools", tmpTools);
      }
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

    getResultString(suitability: Typ.toolCriteriumSuitability): string {
      let min = -1;
      if (
        suitability.fullfillment !== Typ.toolCriteriumFullfillment.undefined
      ) {
        min =
          Math.pow(suitability.criteriumKV.value.importance, 2) *
          suitability.fullfillment;
      }

      const max: number =
        Math.pow(suitability.criteriumKV.value.importance, 2) *
        Typ.toolCriteriumFullfillment.verygood;

      return min + "/" + max;
    },
  },

  //COMPUTED
  computed: {
    getCSV: function (): string {
      let lines: Array<Array<string>> = [];

      let header: Array<string> = ["Tool", "Score"];

      this.getCriteria.forEach((criterium) => {
        header.push(
          criterium.value.name +
            (criterium.value.isExclusionCriterium ? " (!)" : "")
        );
      });

      lines.push(header);

      this.getResults.forEach((result) => {
        let tool: Array<string> = [
          result.toolKV.value.name +
            (result.score.isExcluded ? " (Excluded)" : ""),
          result.score.currentValue + "/" + result.score.maxValue.toString(),
        ];

        result.toolKV.value.criteriaSuitabilities.forEach((suitability) => {
          tool.push(this.getResultString(suitability));
        });

        lines.push(tool);
      });

      return CSVHandler.WriteCSVLine(lines);
    },
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
    getCriteria: function (): Array<Typ.criteriumKeyValue> {
      const unsorted: Array<Typ.criteriumKeyValue> = JSON.parse(
        JSON.stringify(this.$store.getters.getCriteria)
      );

      const sorted: Array<Typ.criteriumKeyValue> =
        this.getSortedCriteria(unsorted);

      return sorted;
    },
    getTools: function (): Array<Typ.toolKeyValue> {
      const json: string = JSON.stringify(this.$store.getters.getTools);
      if (this.isInitialized) {
        window.localStorage.setItem("results", json);
      }
      return JSON.parse(json);
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
  },

  mounted: function () {
    const results = window.localStorage.getItem("results");
    if (results !== null) {
      const tmpTools: Array<Typ.toolKeyValue> = JSON.parse(
        results
      ) as Array<Typ.toolKeyValue>;
      this.$store.dispatch("extendTools", tmpTools);
    }

    this.isInitialized = true;
  },
});
</script>
