<template>
  <div id="ToolCriteriumSuitabilityCreation">
    <v-card min-height="100vh" color="grey lighten-5">
      <v-container>
        <!-- Head -->
        <v-row>
          <v-col xl="11">
            <v-card color="indigo darken-4">
              <h1 style="text-align: center; color: white">
                {{ mode }} tool criterium suitability
              </h1>
            </v-card>
          </v-col>
        </v-row>
        <!-- Body -->
        <v-row>
          <v-col xl="12">
            <v-card outlined>
              <ToolCriteriumSuitabilityCard
                ref="tool_card"
                :propToolCriteriumSuitability="currentSuitability"
                :propModuleState="moduleState"
                @update_tool_suitability="updateCurrentSuitability"
              />
            </v-card>
          </v-col>
        </v-row>
        <!-- Buttons -->
        <v-row>
          <v-col xl="8"> </v-col>
          <v-col xl="1">
            <v-btn @click="btnGoBack()" color="red lighten-5">
              Cancel &amp; Go Back
            </v-btn>
          </v-col>
          <v-col xl="1">
            <v-btn
              v-if="mode === 'Update'"
              @click="btnUpdate()"
              color="blue lighten-5"
            >
              Update-Save-Return
            </v-btn>
          </v-col>
          <v-col xl="1">
            <v-btn
              v-if="!updateSingle"
              @click="btnSave()"
              color="teal lighten-5"
            >
              {{ btnText }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
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
  mdiContentSaveEdit,
} from "@mdi/js";

import Vue from "vue";

import ToolCriteriumSuitabilityCard from "./ToolCriteriumSuitabilityCard.vue";

export default Vue.extend({
  name: "ToolCriteriumSuitabilityCreation",

  components: {
    ToolCriteriumSuitabilityCard,
  },

  //PROPS
  props: {
    propToolKV: {
      type: Object as () => Typ.toolKeyValue,
      default() {
        return {
          key: uuidv4() as string,
          value: {
            name: "" as string,
            description: "" as string,
            criteriaSuitabilities: Array<Typ.toolCriteriumSuitability>(),
          } as Typ.tool,
        } as Typ.toolKeyValue;
      },
    },
  },

  //DATA
  data() {
    return {
      toolKV: JSON.parse(JSON.stringify(this.propToolKV)) as Typ.toolKeyValue,

      currentSuitability: {} as Typ.toolCriteriumSuitability,
      currentSuitabilityIndex: -1 as number,

      moduleState: Typ.simpleModuleState.increation as Typ.simpleModuleState,

      criteria: Array<Typ.criteriumKeyValue>(),

      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
        mdiContentSaveEdit,
      },

      btnText: "Save & Next" as string,
      mode: "Add" as string,
      updateSingle: false as boolean,

      debug: true as boolean,
    };
  },

  //METHODS
  methods: {
    btnGoBack() {
      if (this.updateSingle) {
        this.currentSuitabilityIndex = -1;
        this.resetToolKV();
        this.navigateTo("/Tools/");
      } else {
        this.currentSuitabilityIndex -= 2;

        if (this.currentSuitabilityIndex < -1) {
          let appendix: string = this.mode + "/" + this.toolKV.key;
          this.navigateTo("/ToolCreation/" + appendix);
        } else {
          this.setCurrentSuitability();
        }
      }
    },
    btnSave() {
      const isValid: boolean = (
        this.$refs.tool_card as Vue & { validate: () => boolean }
      ).validate();
      if (isValid) {
        this.$store.dispatch("updateToolSuitability", {
          toolKV: this.toolKV,
          criteriumSuitability: this.currentSuitability,
        });

        const result = this.$store.getters.getTool(this.toolKV.key);
        if (result !== null) {
          this.toolKV = JSON.parse(JSON.stringify(result)) as Typ.toolKeyValue;
        }

        this.setCurrentSuitability();

        if (this.currentSuitabilityIndex >= this.criteria.length) {
          this.currentSuitabilityIndex = -1;
          this.resetToolKV();
          this.navigateTo("/Tools/");
        }
      }
    },
    btnUpdate() {
      const isValid: boolean = (
        this.$refs.tool_card as Vue & { validate: () => boolean }
      ).validate();
      if (isValid) {
        this.$store.dispatch("updateToolSuitability", {
          toolKV: this.toolKV,
          criteriumSuitability: this.currentSuitability,
        });

        this.currentSuitabilityIndex = -1;
        this.resetToolKV();
        this.navigateTo("/Tools/");
      }
    },

    resetToolKV(): void {
      this.toolKV = {
        key: uuidv4() as string,
        value: {
          name: "" as string,
          description: "" as string,
          criteriaSuitabilities: Array<Typ.toolCriteriumSuitability>(),
        } as Typ.tool,
      };
    },
    navigateTo(route: string): void {
      this.$router.push(route);
    },
    getCriteria(): Array<Typ.criteriumKeyValue> {
      return this.$store.getters.getCriteria;
    },
    getFilteredCriteria(): Array<Typ.criteriumKeyValue> {
      let currentCriteria: Array<Typ.criteriumKeyValue> = this.getCriteria();

      /*
      let suitabilities: Array<Typ.toolCriteriumSuitability> = this.toolKV.value.criteriaSuitabilities;
      let suitCriteria: Array<Typ.criteriumKeyValue> = suitabilities.map(x => x.criteriumKV);

      if (suitCriteria.length > 0) {
        //Filter out all (imported) criteria that are also in the current comparision
        //(these do not need to be added twice)
        let filtered: Array<Typ.criteriumKeyValue> = 
          currentCriteria.filter(x => ((suitCriteria.findIndex(y => y.key === x.key) === -1)));

        return filtered;
      }
      */

      return currentCriteria;
    },
    setCurrentSuitability() {
      this.currentSuitabilityIndex++;

      let lenght: number = this.criteria.length;
      if (this.currentSuitabilityIndex < lenght) {
        const found = this.toolKV.value.criteriaSuitabilities.filter(
          (x) =>
            x.criteriumKV.key ===
            this.criteria[this.currentSuitabilityIndex].key
        );
        this.currentSuitability =
          found.length > 0
            ? found[0]
            : {
                criteriumKV: this.criteria[this.currentSuitabilityIndex],
                fullfillment: Typ.toolCriteriumFullfillment.undefined,
                justification: "" as string,
              };
        (
          this.$refs.tool_card as Vue & { resetValidation: () => boolean }
        ).resetValidation();

        if (this.currentSuitabilityIndex === lenght - 1) {
          this.btnText = "Save & Finish";
        }
      }
    },
    updateCurrentSuitability(newVal: Typ.toolCriteriumSuitability) {
      this.currentSuitability = newVal;
    },
  },

  //WATCH
  watch: {
    propToolKV: {
      handler(newVal: Typ.toolKeyValue) {
        this.toolKV = newVal;
      },
      deep: true,
    },
  },

  //MOUNTED
  mounted() {
    this.mode = this.$route.params.mode;
    if (this.mode === "UpdateSingle") {
      this.mode = "Update";
      this.updateSingle = true;
    }

    const tooluuid: string = this.$route.params.toolid;
    const criteriumuuid: string = this.$route.params.criteriumid;

    if (tooluuid !== "" && tooluuid !== uuidNIL) {
      const result = this.$store.getters.getTool(tooluuid);
      if (result !== null) {
        this.toolKV = JSON.parse(JSON.stringify(result)) as Typ.toolKeyValue;

        this.btnText = this.mode + " & Next";

        if (criteriumuuid !== "" && criteriumuuid !== uuidNIL) {
          const suitabilities = this.toolKV.value.criteriaSuitabilities;
          const filtered = suitabilities.filter(
            (x) => x.criteriumKV.key === criteriumuuid
          );
          if (filtered.length > 0) {
            this.criteria = filtered.map((x) => x.criteriumKV);

            this.setCurrentSuitability();
          }

          //LOG
          console.log(
            "ToolCriteriumSuitabilityCreation: Loaded tool with tool: " +
              tooluuid +
              "and criterium: " +
              criteriumuuid
          );

          return;
        }
      }
    }

    this.criteria = this.getFilteredCriteria();
    if (this.criteria.length === 0) {
      this.navigateTo("/Tools/");
    }

    this.setCurrentSuitability();
  },
});
</script>
