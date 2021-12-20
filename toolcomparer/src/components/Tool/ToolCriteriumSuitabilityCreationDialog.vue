<template>
  <div id="ToolCriteriumSuitabilityCreation">
    <v-dialog
      v-model="showDialog"
      height="67vh"
      width="50vw"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card color="grey lighten-5">
        <v-container>
          <!-- Head -->
          <v-row>
            <v-col xl="12">
              <v-card color="indigo darken-4">
                <h1 style="text-align: center; color: white">
                  {{ Typ.convertEditModeEnumToString(mode) }} tool criterium
                  suitability
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
                v-if="mode === Typ.simpleEditMode.Update"
                @click="btnSave(true)"
                color="blue lighten-5"
              >
                Update All &amp; Close
              </v-btn>
            </v-col>
            <v-col xl="1">
              <v-btn @click="btnSave()" color="teal lighten-5">
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
      default() {
        return Array<Typ.criteriumKeyValue>();
      },
    },
    showDialog: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: Number as () => Typ.simpleEditMode,
      default: Typ.simpleEditMode.Add,
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
      Typ,
      noSecHash,
      suitabilityHash: "" as string,

      btnPrevText: "Go Back" as string,
      btnNextText: "Next" as string,
    };
  },

  //METHODS
  methods: {
    btnGoBack() {
      const suitability: Typ.toolCriteriumSuitability = (
        this.$refs.tool_card as Vue & {
          getSuitabilityEvenIncomplete: () => Typ.toolCriteriumSuitability;
        }
      ).getSuitabilityEvenIncomplete();
      const newHash: string = noSecHash(suitability);
      console.log(this.suitabilityHash + "  : " + newHash);
      if (this.suitabilityHash !== newHash) {
        if (this.currentSuitabilityIndex === this.updateSuitabilities.length) {
          this.updateSuitabilities.push(this.currentSuitability);
        } else {
          this.updateSuitabilities[this.currentSuitabilityIndex] = suitability;
        }
      }

      if (this.mode === Typ.simpleEditMode.UpdateSingle) {
        this.currentSuitabilityIndex = -1;
        this.closeDialog(false);
      } else {
        this.currentSuitabilityIndex -= 2;
        if (this.currentSuitabilityIndex < -1) {
          this.closeDialog(false);
        } else {
          this.setCurrentSuitability();
        }
      }
    },
    btnSave(closeDialog = false) {
      const suitability: Typ.toolCriteriumSuitability | null = (
        this.$refs.tool_card as Vue & {
          getSuitabilityIfValid: () => Typ.toolCriteriumSuitability | null;
        }
      ).getSuitabilityIfValid();
      if (suitability !== null) {
        this.currentSuitability = suitability;

        const newHash: string = noSecHash(this.currentSuitability);
        console.log(this.suitabilityHash + "  : " + newHash);
        if (this.suitabilityHash !== newHash) {
          if (
            this.currentSuitabilityIndex === this.updateSuitabilities.length
          ) {
            this.updateSuitabilities.push(this.currentSuitability);
          } else {
            this.updateSuitabilities[this.currentSuitabilityIndex] =
              this.currentSuitability;
          }
        }

        if (closeDialog || this.mode === Typ.simpleEditMode.UpdateSingle) {
          this.updateSuitabilities.forEach((element) => {
            this.$store.dispatch("updateToolSuitability", {
              toolKV: this.toolKV,
              criteriumSuitability: element,
            });
          });
          this.closeDialog(true);
        } else {
          this.setCurrentSuitability();

          if (this.currentSuitabilityIndex >= this.criteria.length) {
            this.currentSuitabilityIndex = -1;
            this.closeDialog(true);
          }
        }
      }
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
      console.log("Inside");
      this.currentSuitabilityIndex++;
      this.btnNextText = "Go Back";
      this.btnNextText = "Next";

      let length: number = this.criteria.length;

      console.log("Cou: " + this.updateSuitabilities.length);
      console.log("Len: " + length);

      if (length <= 0) {
        console.log("No data");
        //this.closeDialog(true);
        return;
      } 
      else if (this.currentSuitabilityIndex < length) {
        if (
          this.mode === Typ.simpleEditMode.Add &&
          this.updateSuitabilities.length > this.currentSuitabilityIndex
        ) {
          console.log("Load updated");
          this.currentSuitability =
            this.updateSuitabilities[this.currentSuitabilityIndex];
        } 
        else {
          console.log("Load new or existing");
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

        (
          this.$refs.tool_card as Vue & { resetValidation: () => boolean }
        ).resetValidation();

        console.log("SUITI: " + this.currentSuitabilityIndex);

        this.suitabilityHash = noSecHash(this.currentSuitability);

        if (this.currentSuitabilityIndex === length - 1) {
          this.btnNextText =
            this.mode === Typ.simpleEditMode.Add ? "Save All" : "Update All";
        } else if (this.mode === Typ.simpleEditMode.UpdateSingle) {
          this.btnPrevText = "Cancel";
          this.btnNextText = "Update";
        }
      }
    },
    getCurrentSuitability(): Typ.toolCriteriumSuitability {
      console.log("CSI: " + this.currentSuitabilityIndex);

      if (this.currentSuitabilityIndex < 0) {
        console.log("SET");
        this.setCurrentSuitability();
      }

      return this.currentSuitability;
    },
    closeDialog(finished: boolean) {
      console.log("FC: " + finished);

      this.resetToolKV();
      this.$emit("closeDialog", finished);
    },
    getSuitabilities(): Array<Typ.toolCriteriumSuitability> {
      return this.updateSuitabilities;
    },
    resetToolKV() {
      this.toolKV = JSON.parse(JSON.stringify(this.propToolKV));
      if (
        this.toolKV.value.name === "" &&
        this.toolKV.value.description === ""
      ) {
        this.toolKV.key = uuidv4();
      }
      this.currentSuitabilityIndex = -1;
    },
  },

  //WATCH
  watch: {
    propToolKV: {
      handler(oldVal: Typ.toolKeyValue, newVal: Typ.toolKeyValue) {
        this.resetToolKV();
        if (oldVal.key !== newVal.key) {
          this.updateSuitabilities = Array<Typ.toolCriteriumSuitability>();
        }
      },
      deep: true,
    },
  },
});
</script>
