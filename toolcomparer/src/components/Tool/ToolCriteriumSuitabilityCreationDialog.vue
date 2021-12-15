<template>
  <div id="ToolCriteriumSuitabilityCreation">
    <v-dialog
      v-model="showDialog"
      width="33vw"
      hide-overlay
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card color="grey lighten-5">
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
                  :propToolCriteriumSuitability="getCurrentSuitability()"
                  :propModuleState="moduleState"
                />
              </v-card>
            </v-col>
          </v-row>
          <!-- Buttons -->
          <v-row>
            <v-col xl="8"> </v-col>
            <v-col xl="1">
              <v-btn @click="btnGoBack()" color="red lighten-5">
                {{ btnPrevText }}
              </v-btn>
            </v-col>
            <v-col xl="1">
              <v-btn
                v-if="mode === 'Update'"
                @click="btnSave(true)"
                color="blue lighten-5"
              >
                Update All &amp; Close
              </v-btn>
            </v-col>
            <v-col xl="1">
              <v-btn
                v-if="!updateSingle"
                @click="btnSave()"
                color="teal lighten-5"
              >
                {{ btnNextText }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { v4 as uuidv4 } from "uuid";
import { NIL as uuidNIL } from "uuid";
import { sha1 as noSecHash } from "object-hash";


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
    criteria: {
      type: Array as () => Array<Typ.criteriumKeyValue>,
    },

    mode: {
      type: String,
      default: "Add",
    },
    updateSingle: {
      type: Boolean,
      default: false,
    },
  },

  //DATA
  data() {
    return {
      toolKV: JSON.parse(JSON.stringify(this.propToolKV)) as Typ.toolKeyValue,

      currentSuitability: {} as Typ.toolCriteriumSuitability,  
      currentSuitabilityIndex: -1 as number,
      updateSuitabilities: Array<Typ.toolCriteriumSuitability>(),

      moduleState: Typ.simpleModuleState.increation as Typ.simpleModuleState,

      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
        mdiContentSaveEdit,
      },
      noSecHash,
      suitabilityHash: "" as string,

      btnPrevText: "Go Back" as string,
      btnNextText: "Next" as string,
      mode: "Add" as string,
      updateSingle: false as boolean,
    };
  },

  //METHODS
  methods: {
    btnGoBack() {
      if (this.updateSingle) {
        this.currentSuitabilityIndex = -1;
        this.resetToolKV();
        this.closeDialog();
      } else {  

        this.currentSuitabilityIndex -= 2;
        if (this.currentSuitabilityIndex < -1) {
          this.closeDialog();
        } else {
          this.setCurrentSuitability();
        }
      }
    },
    btnSave(closeDialog: boolean = true) {
      const suitability: Typ.toolCriteriumSuitability | null = (
            this.$refs.tool_card as Vue & { getSuitabilityIfValid: () => Typ.toolCriteriumSuitability | null }
          ).getSuitabilityIfValid();
      if (suitability !== null) {
        this.currentSuitability = suitability;

        const newHash: string = noSecHash(this.currentSuitability);
        if (this.suitabilityHash !== newHash) {
           this.updateSuitabilities.push(this.currentSuitability);
        }   

         if (closeDialog) {
              this.updateSuitabilities.forEach(element => {
                this.$store.dispatch("updateToolSuitability", {
                    toolKV: this.toolKV,
                    criteriumSuitability: element
                  });
              });
              
              this.resetToolKV();
              this.closeDialog();
            }
            else if (this.mode === "Add") {            
              this.setCurrentSuitability();

              if (this.currentSuitabilityIndex >= this.criteria.length) {
                this.currentSuitabilityIndex = -1;
                this.resetToolKV();
                this.closeDialog();
              }
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
    getFilteredCriteria(): Array<Typ.criteriumKeyValue> {
      let currentCriteria: Array<Typ.criteriumKeyValue> = this.criteria;

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
      this.btnNextText = "Go Back";
      this.btnNextText = "Next";

      let lenght: number = this.criteria.length;
      if (this.currentSuitabilityIndex < lenght) {
        if (this.updateSuitabilities.length > this.currentSuitabilityIndex + 1) {
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
        }
        else {
          this.currentSuitability = this.updateSuitabilities[this.currentSuitabilityIndex];
        }
        
        (this.$refs.tool_card as Vue & { resetValidation: () => boolean }
        ).resetValidation();

        this.suitabilityHash = noSecHash(this.currentSuitability);

        if (this.currentSuitabilityIndex === lenght - 1) {
          this.btnNextText = "Save All";
        }
        else if (this.updateSingle) {
          this.btnPrevText = "Cancel"
        }
      }
    },
    getCurrentSuitability(): Typ.toolCriteriumSuitability {
      if (this.currentSuitabilityIndex < 0) {
        this.setCurrentSuitability;
      }

      return this.currentSuitability;
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
    getSuitabilities(): Array<Typ.toolCriteriumSuitability> {
      return this.updateSuitabilities;
    }
  },
});
</script>
