<template>
  <div id="CriteriumCreationDialog">
    <v-dialog
      v-model="showDialog"
      height="67vh"
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
                  {{ Typ.convertEditModeEnumToString(mode) }} Criterium
                </h1>
              </v-card>
            </v-col>
          </v-row>
          <!-- Body -->
          <v-row>
            <v-col>
              <v-card outlined>
                <CriteriumCard
                  ref="criterium_card"
                  :propCriteriumKV="criteriumKV"
                  :propModuleState="moduleState"
                />
              </v-card>
            </v-col>
          </v-row>
          <!-- Buttons -->
          <v-row>
            <v-card-actions>
              <v-btn @click="btnCancel()" color="red lighten-5"> Cancel </v-btn>
            </v-card-actions>
            <v-card-actions>
              <v-btn @click="btnSave()" color="teal lighten-5">
                {{ getBtnNextTxt }}
              </v-btn>
            </v-card-actions>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <template v-if="workflow === 'ToolsFirst'">
      <ToolCriteriumSuitabilityCreationDialog
        v-show="isInSuitabilityCreation"
        ref="suit_creation"
        :mode="mode"
        :workflow="workflow"
        :showDialog="isInSuitabilityCreation"
        :propCriteriumKV="criteriumKV"
        :tools="tools"
        v-on:closeDialog="saveAndCloseDialog"
      />
    </template>
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

import CriteriumCard from "./CriteriumCard.vue";
import ToolCriteriumSuitabilityCreationDialog from "../Tool/ToolCriteriumSuitabilityCreationDialog.vue";

export default Vue.extend({
  name: "CriteriumCreationDialog",

  components: {
    CriteriumCard,
    ToolCriteriumSuitabilityCreationDialog,
  },

  //PROPS
  props: {
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
    },
    forceSkipToSuitabilities: {
      type: Boolean,
      default: false,
    },
  },

  //DATA
  data() {
    return {
      criteriumKV: JSON.parse(
        JSON.stringify(this.propCriteriumKV)
      ) as Typ.criteriumKeyValue,
      moduleState: Typ.simpleModuleState.increation as Typ.simpleModuleState,
      isInSuitabilityCreation: this.forceSkipToSuitabilities as boolean,

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
    };
  },

  //METHODS
  methods: {
    btnCancel() {
      this.closeDialog();
    },
    btnSave() {
      const criteriumKV: Typ.criteriumKeyValue | null = (
        this.$refs.criterium_card as Vue & {
          getCriteriumKVIfValid: () => Typ.criteriumKeyValue | null;
        }
      ).getCriteriumKVIfValid();
      if (criteriumKV !== null) {
        this.criteriumKV = criteriumKV;

        if (
          this.workflow === "ToolsFirst" &&
          this.tools &&
          this.tools.length > 0
        ) {
          this.isInSuitabilityCreation = true;
        } else {
          this.saveAndCloseDialog(true);
        }
      }
    },
    saveAndCloseDialog(finished: boolean) {
      if (!finished) {
        this.isInSuitabilityCreation = false;
        return;
      }

      const propHash = this.noSecHash(this.propCriteriumKV);
      const newHash = this.noSecHash(this.criteriumKV);
      //When adding: criterium needs to be stored first
      if (
        (this.workflow === "CriteriaFirst" ||
          this.mode === Typ.simpleEditMode.Add) &&
        propHash !== newHash
      ) {
        (this.$refs.criterium_card as Vue & { save: () => boolean }).save();
      }

      if (this.workflow === "ToolsFirst") {
        const updateSuitabilities: Array<Typ.toolKVSuitabilityItem> = (
          this.$refs.suit_creation as Vue & {
            getSuitabilities: () => Array<Typ.toolKVSuitabilityItem>;
          }
        ).getSuitabilities();

        if (
          this.mode !== Typ.simpleEditMode.Add ||
          this.tools.length === updateSuitabilities.length
        ) {
          updateSuitabilities.forEach((element) => {
            this.$store.dispatch("updateToolSuitability", {
              toolKV: element.toolKV,
              criteriumSuitability: element.suitability,
            });
          });

          //When updating: criterium needs to be updated after tools
          //This will force that all tools will be updated with the new content of the criterium
          if (propHash !== newHash) {
            (this.$refs.criterium_card as Vue & { save: () => boolean }).save();
          }

          this.closeDialog();
        }
      } else {
        this.closeDialog();
      }
    },
    closeDialog() {
      this.isInSuitabilityCreation = false;
      this.updateCriteriumKV();
      this.$emit("closeDialog");
    },
    updateCriteriumKV() {
      this.criteriumKV = JSON.parse(JSON.stringify(this.propCriteriumKV));
      if (
        this.criteriumKV.value.name === "" &&
        this.criteriumKV.value.description === "" &&
        this.criteriumKV.value.importance === Typ.criteriumImportance.undefined
      ) {
        this.criteriumKV.key = uuidv4();
      }
    },
  },

  //WATCH
  watch: {
    propCriteriumKV: {
      handler() {
        this.updateCriteriumKV();
      },
      deep: true,
    },
  },

  computed: {
    getBtnNextTxt: function (): string {
      return (
        this.workflow === "ToolsFirst" && this.tools && this.tools.length > 0
          ? "Next"
          : this.mode === Typ.simpleEditMode.Add
          ? "Add"
          : "Update"
      ) as string;
    },
  },
});
</script>
