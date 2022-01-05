<template>
  <v-dialog
    v-model="featuresDialog"
    height="33vh"
    width="33vw"
    persistent
    transition="dialog-bottom-transition"
    id="FeaturesDialog"
  >
    <v-card class="overflow-hidden">
      <v-app-bar
        absolute
        scroll-target="#scrolling-techniques-4"
        style="position: relative"
      >
        <v-toolbar-title>Features</v-toolbar-title>
        <v-btn
          style="position: absolute; right: 1em; top: 0em"
          icon
          @click="closeFeatures()"
        >
          <v-icon>{{ icons.mdiClose }}</v-icon>
        </v-btn>

        <template v-slot:extension>
          <v-tabs align-with-title>
            <v-tab @click="mode = 'Import'">Import</v-tab>
            <v-tab @click="mode = 'Export'">Export</v-tab>
          </v-tabs>
        </template>
      </v-app-bar>
      <v-sheet id="scrolling-techniques-4" class="overflow-y-auto">
        <v-container v-show="mode === 'Export'" style="height: 25vh">
          <v-row>
            <v-radio-group v-model="radExportGroup">
              <v-radio
                :key="0"
                :label="'Export ' + caller + ' as JSON'"
                :value="0"
              ></v-radio>
              <v-radio
                v-show="caller === 'Comparision'"
                :key="1"
                :label="'Export ' + caller + ' as CSV'"
                :value="1"
              ></v-radio>
            </v-radio-group>
          </v-row>
          <v-row>
            <v-col>
              <v-spacer> </v-spacer>
            </v-col>
          </v-row>
          <v-row>
            <v-btn @click="exporter()"> Export </v-btn>
          </v-row>
        </v-container>
        <v-container v-show="mode === 'Import'" style="height: 25vh">
          <v-row>
            <v-radio-group v-model="radImportGroup">
              <v-radio
                :key="0"
                :label="'Import ' + caller + ' from JSON'"
                :value="0"
              ></v-radio>
              <v-radio
                v-show="caller === 'Comparision'"
                :key="1"
                :label="'Import (readonly) ' + caller + ' from CSV'"
                :value="1"
              ></v-radio>
            </v-radio-group>
          </v-row>
          <v-row>
            <v-col>
              <v-spacer> </v-spacer>
            </v-col>
          </v-row>
          <v-row>
            <v-btn @click="importer()"> Import </v-btn>
            <input
              ref="uploader"
              class="d-none"
              type="file"
              :accept="radImportGroup === 0 ? '.json' : '.csv'"
              @change="onFileChanged"
            />
          </v-row>
        </v-container>
      </v-sheet>
    </v-card>
  </v-dialog>
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
  mdiContentSaveEdit,
  mdiFileRestoreOutline,
  mdiClose,
} from "@mdi/js";

import Vue from "vue";
import goTo from "vuetify/lib/services/goto";

export default Vue.extend({
  name: "FeaturesDialog",

  props: {
    featuresDialog: {
      type: Boolean,
      default: false,
    },
    caller: {
      type: String,
      default: "Comparision",
    },
  },

  //DATA
  data() {
    return {
      radExportGroup: 0,
      radImportGroup: 0,

      rules: {
        required: (value: boolean | string) => !!value || "Required",
        str: [
          (val: string) => (val || "").length > 0 || "This field is required",
        ],
      },
      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
        mdiContentSaveEdit,
        mdiFileRestoreOutline,
        mdiClose,
      },
      Typ,

      isValid: true as boolean,
      mode: "Import" as string,
    };
  },

  methods: {
    closeFeatures() {
      this.radExportGroup = 0;
      this.radImportGroup = 0;
      this.$emit("closeFeatures");
    },
    exporter() {
      let file = "";
      let filename = "";
      switch (this.radExportGroup) {
        case 0:
          {
            switch (this.caller) {
              // eslint-disable-next-line no-fallthrough
              case "Comparision":
              //fall-through
              // eslint-disable-next-line no-fallthrough
              case "Tools":
                {
                  file = JSON.stringify(this.$store.getters.getTools);
                  filename =
                    this.caller === "Tools"
                      ? "toolcomparer_tools.json"
                      : "toolcomparer_results.json";
                }
                break;
              case "Criteria":
                {
                  file = JSON.stringify(this.$store.getters.getCriteria);
                  filename = "toolcomparer_criteria.json";
                }
                break;
            }
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
        switch (this.radImportGroup) {
          case 0:
            {
              switch (this.caller) {
                // eslint-disable-next-line no-fallthrough
                    case "Comparision":
                    //fall-through
                    // eslint-disable-next-line no-fallthrough
                case "Tools":
                  {
                    const tmpTools: Array<Typ.toolKeyValue> = JSON.parse(
                      txt
                    ) as Array<Typ.toolKeyValue>;
                    this.$store.dispatch("extendTools", tmpTools);
                  }
                  break;
                case "Criteria":
                    {
                      const tmpCriteria: Array<Typ.criteriumKeyValue> = JSON.parse(
                        txt
                      ) as Array<Typ.criteriumKeyValue>;
                      this.$store.dispatch("extendCriteria", tmpCriteria);
                    }
                    break;
              }
            }
            break;
          case 1:
            {
              //TODO: Add CSV Import Support
            }
          break;
        }
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
    getResultString(suitability: Typ.toolCriteriumSuitability): string {
      const max: number =
        Math.pow(suitability.criteriumKV.value.importance, 2) *
        Typ.toolCriteriumFullfillment.verygood;

      const min: number =
        Math.pow(suitability.criteriumKV.value.importance, 2) *
        suitability.fullfillment;

      return min + "/" + max;
    },
  },

  //COMPUTED
  computed: {
    getCSV: function (): string {
      let stringBuilder = "";
      this.getCriteria.forEach((criterium) => {
        stringBuilder += criterium.value.name + ",";
      });
      stringBuilder.slice(0, -1) + "\n";

      this.getResults.forEach((result) => {
        stringBuilder +=
          result.toolKV.value.name +
          "," +
          result.score.currentValue +
          "/" +
          result.score.maxValue +
          ",";

        result.toolKV.value.criteriaSuitabilities.forEach((suitability) => {
          stringBuilder += this.getResultString(suitability) + ",";
        });

        stringBuilder.slice(0, -1) + "\n";
      });

      return stringBuilder;
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
          //TO DO
          //REDIRECT AND INFORM
        }
      });

      const sorted = this.getSorted(converted);
      const ranked = this.getRanked(sorted);

      return ranked;
    },
    getCriteria(): Array<Typ.criteriumKeyValue> {
      const unsorted: Array<Typ.criteriumKeyValue> =
        this.$store.getters.getCriteria;

      return unsorted.sort((a, b) => {
        if (a.value.isExclusionCriterium === b.value.isExclusionCriterium) {
          return b.value.importance - a.value.importance;
        } else if (a.value.isExclusionCriterium) {
          return -1;
        } else {
          return 1;
        }
      });
    },
    getMaxScore(): number {
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
});
</script>
