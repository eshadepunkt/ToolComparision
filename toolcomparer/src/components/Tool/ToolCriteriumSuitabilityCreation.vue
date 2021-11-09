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
          <v-col xl="11">
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
            <v-btn @click="btnCancel()" color="red lighten-5"> Cancel </v-btn>
          </v-col>
          <v-col xl="1"> </v-col>
          <v-col xl="1">
            <v-btn @click="btnSave()" color="teal lighten-5">
              {{ btnText }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts">
console.log("Load ToolCriteriumSuitabilityCreation.vue");

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

      criteria: {} as Array<Typ.criteriumKeyValue>,

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

      debug: true as boolean,
    };
  },

  //METHODS
  methods: {
    btnCancel() {
      this.resetToolKV();
      this.navigateTo("/Tools/");
    },
    btnSave() {
      const isValid: boolean = (this.$refs.tool_card as Vue & { validate: () => boolean }).validate();
      if (isValid) {
        this.$store.dispatch("appendToolCriteriumSuitabilities", { 
          toolKV: this.toolKV,
          criteriumSuitability: this.currentSuitability 
        });

        this.setCurrentSuitability();

        if (this.currentSuitabilityIndex >= this.criteria.length) {
          this.currentSuitabilityIndex = -1;
          this.resetToolKV();
          this.navigateTo("/Tools/");
        }      
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
      var currentCriteria: Array<Typ.criteriumKeyValue> = this.getCriteria();

      var suitabilities: Array<Typ.toolCriteriumSuitability> = this.toolKV.value.criteriaSuitabilities;
      var suitCriteria: Array<Typ.criteriumKeyValue> = suitabilities.map(x => x.criteriumKV);

      if (suitCriteria.length > 0) {
        //Filter out all (imported) criteria that are also in the current comparision
        //(these do not need to be added twice)
        var filtered: Array<Typ.criteriumKeyValue> = 
          currentCriteria.filter(x => ((suitCriteria.findIndex(y => y.key === x.key) === -1)));

        return filtered;
      }
      else {
        return currentCriteria;
      }
    },
    setCurrentSuitability() {
      (this.currentSuitabilityIndex)++;

      var lenght: number = this.criteria.length;
      if (this.currentSuitabilityIndex < lenght) {
        this.currentSuitability = {
          criteriumKV: this.criteria[this.currentSuitabilityIndex],
          fullfillment: Typ.toolCriteriumFullfillment.undefined,
          justification: "" as string,
        };

        if (this.currentSuitabilityIndex === lenght - 1) {
          this.btnText = "Save & Finish";
        }
      }
    },
    updateCurrentSuitability(newVal: Typ.toolCriteriumSuitability) {
      this.currentSuitability = newVal;
    }
  },

  //WATCH
  watch: {
    propTool: {
      handler(newVal: Typ.toolKeyValue) {
        this.toolKV = newVal;

        //LOG
        console.log("ToolCriteriumSuitabilityCreation: propToolKV changed!");
      },
      deep: true,
    },
  },

  //MOUNTED
  mounted() {
    this.mode = this.$route.params.mode;

    const uuid: string = this.$route.params.id;

    if (uuid !== uuidNIL) {
      const result = this.$store.getters.getTool(uuid);
      if (result !== null) {
        this.toolKV = JSON.parse(JSON.stringify(result)) as Typ.toolKeyValue;

        this.btnText = this.mode;

        //LOG
        console.log("ToolCriteriumSuitabilityCreation: Loaded tool with key: " + uuid);
      }
    }

    this.criteria = this.getFilteredCriteria();
    this.setCurrentSuitability();

    //LOG
    console.log("ToolCriteriumSuitabilityCreation: Mounted");
  },
});
</script>
