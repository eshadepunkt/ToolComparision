<<template>
  <v-dialog
    v-model="showSettings"
    height="50vh"
    width="33vw"
    persistent
    transition="dialog-bottom-transition"
    id="ExportDialog"
  >
    <v-card class="overflow-hidden">
      <v-container>
         <v-row>
            <v-radio-group v-model="radioGroup">
               <v-radio
               :key="0"
               :label="'Export as JSON'"
               :value="0"
               ></v-radio>
               <v-radio
               :key="1"
               :label="'Export as CSV'"
               :value="1"
               ></v-radio>
            </v-radio-group>
         <v-row>
         <v-row>
            <v-btn @click="exporter()">
              Export
            </v-btn>
         </v-row>
      </v-container>
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

export default Vue.extend({
  name: "ExportDialog",

  props: {
    exportDialog: {
      type: Boolean,
      default: false,
    },
  },

  //DATA
  data() {
    return {
      radioGroup: 0,

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
      isWorkflow: true as boolean,
    };
  },

  methods: {
    closeExport() {
      this.$emit("closeExport");
    },
    exporter() {
      let file = "";
      let filename = "";
      switch (this.radioGroup) {
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
     getCSV: function(): string {
        let stringBuilder: string = "";
        this.getCriteria.forEach(criterium => {
           stringBuilder += criterium.value.name + ",";
        });
        stringBuilder.slice(0, -1) + "\n";

        this.getResults.forEach(result => {
           stringBuilder += result.toolKV.value.name + "," 
            + result.score.currentValue +
            "/" +
            result.score.maxValue + ",";

            result.toolKV.value.criteriaSuitabilities.forEach(suitability => {
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
