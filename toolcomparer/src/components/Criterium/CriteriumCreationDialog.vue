<template>
  <div id="CriteriumCreation">
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
            <v-col xl="3">
              <v-card color="indigo darken-4">
                <h1 style="text-align: center; color: white">
                  {{ Typ.convertEditModeEnumToString(mode) }} Criterium
                </h1>
              </v-card>
            </v-col>
          </v-row>
          <!-- Body -->
          <v-row>
            <v-col xl="3">
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
            <v-col xl="2"> </v-col>
            <v-col xl="1">
              <v-btn @click="btnCancel()" color="red lighten-5"> Cancel </v-btn>
            </v-col>
            <v-col xl="1"> </v-col>
            <v-col xl="1">
              <v-btn @click="btnSave()" color="teal lighten-5">
                {{ Typ.convertEditModeEnumToString(mode) }}
              </v-btn>
            </v-col>
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
  name: "CriteriumCreation",

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
  },

  //DATA
  data() {
    return {
      criteriumKV: JSON.parse(
        JSON.stringify(this.propCriteriumKV)
      ) as Typ.criteriumKeyValue,
      moduleState: Typ.simpleModuleState.increation as Typ.simpleModuleState,
      isInSuitabilityCreation: false,

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
          this.workflow !== "CriteriaFirst" &&
          this.tools &&
          this.tools.length > 0
        ) {
          console.log("SC");

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
      if (propHash !== newHash) {
        (this.$refs.criterium as Vue & { save: () => boolean }).save();
      }

      if (this.workflow !== "CriteriaFirst") {
        const updateSuitabilities: Array<Typ.toolCriteriumSuitability> = (
          this.$refs.suit_creation as Vue & {
            getSuitabilities: () => Array<Typ.toolCriteriumSuitability>;
          }
        ).getSuitabilities();
        if (
          this.mode === Typ.simpleEditMode.Add &&
          this.tools.length === updateSuitabilities.length
        ) {
          for (let index = 0; index < updateSuitabilities.length; index++) {
            const element = updateSuitabilities[index];
            this.$store.dispatch("updateToolSuitability", {
              toolKV: this.tools[index],
              criteriumSuitability: element,
            });
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
});
</script>
