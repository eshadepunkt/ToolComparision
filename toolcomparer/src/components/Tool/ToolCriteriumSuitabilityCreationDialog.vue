<template>
  <div id="ToolCriteriumSuitabilityCreation">
    <v-dialog
      v-model="showDialog"
      height="100vh"
      width="50vw"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card color="grey lighten-5">
        <v-container fluid>
          <!-- Head -->
          <v-row>
            <v-col>
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
            <v-col>
              <v-card outlined>
                <ToolCriteriumSuitabilityCard
                  ref="tool_card"
                  :propToolKVSuitabilityItem="getCurrentSuitability()"
                  :propModuleState="moduleState"
                  :workflow="workflow"
                />
              </v-card>
            </v-col>
          </v-row>
          <!-- Buttons -->
          <v-row>
            <v-card-actions>
              <v-btn @click="btnGoBack()" color="red lighten-5">
                {{ btnPrevText }}
              </v-btn>
            </v-card-actions>
            <v-card-actions>
              <v-btn
                v-if="mode === Typ.simpleEditMode.Update"
                @click="btnSave(true)"
                color="blue lighten-5"
              >
                Update All &amp; Close
              </v-btn>
            </v-card-actions>
            <v-card-actions>
              <v-btn @click="btnSave()" color="teal lighten-5">
                {{ btnNextText }}
              </v-btn>
            </v-card-actions>
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
        return new Array<Typ.criteriumKeyValue>();
      },
    },
    propCriteriumKV: {
      type: Object as () => Typ.criteriumKeyValue,
      default() {
        return {
          key: uuidv4() as string,
          value: {
            name: "",
            description: "",
            importance: Typ.criteriumImportance.undefined,
            isExclusionCriterium: false,
          } as Typ.criterium,
        } as Typ.criteriumKeyValue;
      },
    },
    tools: {
      type: Array as () => Array<Typ.toolKeyValue>,
      default() {
        return new Array<Typ.toolKeyValue>();
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
    workflow: {
      type: String,
      default: "CriteriaFirst",
    },
  },

  //DATA
  data() {
    return {
      toolKV: JSON.parse(JSON.stringify(this.propToolKV)) as Typ.toolKeyValue,

      currentSuitability: {} as Typ.toolKVSuitabilityItem,
      currentSuitabilityIndex: -1 as number,
      updateSuitabilities: new Array<Typ.toolKVSuitabilityItem>(),

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
      if (this.mode === Typ.simpleEditMode.UpdateSingle) {
        this.currentSuitabilityIndex = -1;
        this.closeDialog(false);
      } else {
        this.currentSuitabilityIndex -= 2;
        if (this.currentSuitabilityIndex < -1) {
          this.currentSuitabilityIndex = -1;
          this.closeDialog(false);
        } else {
          this.setCurrentSuitability();
        }
      }
    },
    btnSave(closeDialog = false) {
      const suitability: Typ.toolKVSuitabilityItem | null = (
        this.$refs.tool_card as Vue & {
          getSuitabilityIfValid: () => Typ.toolKVSuitabilityItem | null;
        }
      ).getSuitabilityIfValid();
      if (suitability !== null) {
        this.currentSuitability = suitability;

        const newHash: string = noSecHash(this.currentSuitability);
        if (this.suitabilityHash !== newHash) {
          if (
            this.currentSuitabilityIndex === this.updateSuitabilities.length
          ) {
            console.log("Changes pushed");

            this.updateSuitabilities.push(this.currentSuitability);
          } else {
            this.updateSuitabilities[this.currentSuitabilityIndex] =
              this.currentSuitability;
          }
        }

        if (closeDialog || this.mode === Typ.simpleEditMode.UpdateSingle) {
          if (this.workflow === "CriteriaFirst") {
            this.updateSuitabilitiesOfTool();
          }

          this.closeDialog(true);
        } else {
          this.setCurrentSuitability();

          console.log("CurrentSuitIndex: " + this.currentSuitabilityIndex);

          const length: number =
            this.workflow === "CriteriaFirst"
              ? this.criteria.length
              : this.tools.length;

          if (this.currentSuitabilityIndex >= length) {
            this.currentSuitabilityIndex = -1;
            this.closeDialog(true);
          }
        }
      }
    },
    updateSuitabilitiesOfTool() {
      this.updateSuitabilities.forEach((element) => {
        this.$store.dispatch("updateToolSuitability", {
          toolKV: element.toolKV,
          criteriumSuitability: element.suitability,
        });
      });
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
      this.btnNextText =
        this.mode === Typ.simpleEditMode.UpdateSingle ? "Cancel" : "Go Back";
      this.btnNextText =
        this.mode === Typ.simpleEditMode.UpdateSingle ? "Update" : "Next";

      const length: number =
        this.workflow === "CriteriaFirst"
          ? this.criteria.length
          : this.tools.length;

      if (length <= 0) {
        //this.closeDialog(true);
        return;
      } else if (this.currentSuitabilityIndex < length) {
        if (this.workflow === "ToolsFirst") {
          this.toolKV = this.tools[this.currentSuitabilityIndex];
        }

        if (
          this.mode === Typ.simpleEditMode.Add &&
          this.updateSuitabilities.length > this.currentSuitabilityIndex
        ) {
          this.currentSuitability =
            this.updateSuitabilities[this.currentSuitabilityIndex];
        } else {
          const found = this.toolKV.value.criteriaSuitabilities.filter(
            (x) =>
              x.criteriumKV.key ===
              (this.workflow === "CriteriaFirst"
                ? this.criteria[this.currentSuitabilityIndex].key
                : this.propCriteriumKV.key)
          );
          this.currentSuitability = {
            toolKV:
              this.workflow === "CriteriaFirst"
                ? this.toolKV
                : this.tools[this.currentSuitabilityIndex],
            suitability: JSON.parse(
              JSON.stringify(
                found.length > 0
                  ? found[0]
                  : {
                      criteriumKV:
                        this.workflow === "CriteriaFirst"
                          ? this.criteria[this.currentSuitabilityIndex]
                          : this.propCriteriumKV,
                      fullfillment: Typ.toolCriteriumFullfillment.undefined,
                      justification: "" as string,
                    }
              )
            ),
          };
        }

        console.log(
          "After Next: " +
            this.currentSuitabilityIndex +
            " : " +
            this.updateSuitabilities.length
        );

        try {
          (
            this.$refs.tool_card as Vue & { resetValidation: () => boolean }
          ).resetValidation();
        } catch {
          console.log("Validation reseted");
        }

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
    getCurrentSuitability(): Typ.toolKVSuitabilityItem {
      if (this.currentSuitabilityIndex < 0) {
        this.setCurrentSuitability();
      }

      return this.currentSuitability;
    },
    closeDialog(finished: boolean) {
      console.log("Closing");

      this.resetToolKV();
      this.$emit("closeDialog", finished);
    },
    getSuitabilities(): Array<Typ.toolKVSuitabilityItem> {
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
          this.updateSuitabilities = new Array<Typ.toolKVSuitabilityItem>();
        }
      },
      deep: true,
    },
    propCriteriumKV: {
      handler(oldVal: Typ.criteriumKeyValue, newVal: Typ.criteriumKeyValue) {
        this.resetToolKV();
        if (oldVal.key !== newVal.key) {
          this.updateSuitabilities = new Array<Typ.toolKVSuitabilityItem>();
        }
      },
      deep: true,
    },
  },
});
</script>
