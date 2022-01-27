<template>
  <div id="ToolCreationDialog">
    <v-dialog
      v-show="!isInSuitabilityCreation"
      v-model="showDialog"
      height="67vh"
      width="50vw"
      persistent
      :retain-focus="false"
      transition="dialog-bottom-transition"
    >
      <v-card color="grey lighten-5">
        <v-container fluid>
          <!-- Head -->
          <v-row>
            <v-col>
              <v-card color="indigo darken-4">
                <h1 style="text-align: center; color: white">
                  {{ Typ.convertEditModeEnumToString(mode) }} tool
                </h1>
              </v-card>
            </v-col>
          </v-row>
          <!-- Body -->
          <v-row>
            <v-col>
              <v-card outlined>
                <ToolCard
                  ref="tool_card"
                  :propToolKV="toolKV"
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
              <v-btn
                v-if="mode === Typ.simpleEditMode.Update"
                @click="btnSave(true)"
                color="blue lighten-5"
              >
                Update All &amp; Close
              </v-btn>
            </v-card-actions>
            <v-card-actions>
              <v-btn @click="btnSave(false)" color="teal lighten-5">
                {{ getBtnNextTxt }}
              </v-btn>
            </v-card-actions>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <template v-if="workflow === 'CriteriaFirst'">
      <ToolCriteriumSuitabilityCreationDialog
        v-show="isInSuitabilityCreation"
        ref="suit_creation"
        :propToolKV="toolKV"
        :mode="mode"
        :showDialog="isInSuitabilityCreation"
        :criteria="criteria"
        :forceSkipToSuitabilities="forceSkipToSuitabilities"
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

import ToolCard from "./ToolCard.vue";
import ToolCriteriumSuitabilityCreationDialog from "./ToolCriteriumSuitabilityCreationDialog.vue";

export default Vue.extend({
  name: "ToolCreationDialog",

  components: {
    ToolCard,
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
    propToolKV: {
      type: Object as () => Typ.toolKeyValue,
      default() {
        return {
          key: uuidv4() as string,
          value: {
            name: "",
            description: "",
            criteriaSuitabilities: new Array<Typ.toolCriteriumSuitability>(),
          } as Typ.tool,
        } as Typ.toolKeyValue;
      },
    },
    criteria: {
      type: Array as () => Array<Typ.criteriumKeyValue>,
    },
    forceSkipToSuitabilities: {
      type: Boolean,
      default: false,
    },
  },

  //DATA
  data() {
    return {
      toolKV: JSON.parse(JSON.stringify(this.propToolKV)) as Typ.toolKeyValue,
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

      isInSuitabilityCreation: (this.forceSkipToSuitabilities &&
        this.showDialog) as boolean,
    };
  },

  //METHODS
  methods: {
    btnCancel() {
      this.closeDialog();
    },
    btnSave(saveAndCloseDialog = false) {
      const toolKV: Typ.toolKeyValue | null = (
        this.$refs.tool_card as Vue & {
          getToolKVIfValid: () => Typ.toolKeyValue | null;
        }
      ).getToolKVIfValid();
      if (toolKV !== null) {
        this.toolKV = toolKV;

        if (
          !saveAndCloseDialog &&
          this.workflow === "CriteriaFirst" &&
          ((this.propToolKV.value.criteriaSuitabilities &&
            this.propToolKV.value.criteriaSuitabilities.length > 0) ||
            (this.criteria && this.criteria.length > 0))
        ) {
          this.isInSuitabilityCreation = true;
        } else {
          this.saveAndCloseDialog(true);
        }
      }
    },
    saveAndCloseDialog(finished: boolean) {
      if (!finished) {
        if (!this.forceSkipToSuitabilities) {
          this.isInSuitabilityCreation = false;
          return;
        }

        this.closeDialog();
      }

      const propHash = this.noSecHash(this.propToolKV);
      const newHash = this.noSecHash(this.toolKV);
      //When adding: tool needs to be stored first
      if (
        (this.workflow === "ToolsFirst" ||
          this.mode === Typ.simpleEditMode.Add) &&
        propHash !== newHash
      ) {
        (this.$refs.tool_card as Vue & { save: () => boolean }).save();
      }

      if (this.workflow === "CriteriaFirst") {
        const updateSuitabilities: Array<Typ.toolKVSuitabilityItem> = (
          this.$refs.suit_creation as Vue & {
            getSuitabilities: () => Array<Typ.toolKVSuitabilityItem>;
          }
        ).getSuitabilities();
        if (
          this.mode !== Typ.simpleEditMode.Add ||
          this.criteria.length === updateSuitabilities.length
        ) {
          //When updating: tool needs to be updated after suitabilities
          //Needs to be before criteria changes, so that the old suitabilities do not override the new
          if (propHash !== newHash) {
            (this.$refs.tool_card as Vue & { save: () => boolean }).save();
          }

          updateSuitabilities.forEach((element) => {
            this.$store.dispatch("updateToolSuitability", {
              toolKV: element.toolKV,
              criteriumSuitability: element.suitability,
            });
          });

          this.closeDialog();
        }
      } else {
        this.closeDialog();
      }
    },
    closeDialog() {
      this.isInSuitabilityCreation = false;
      this.updateToolKV();
      this.$emit("closeDialog");
    },
    updateToolKV() {
      this.toolKV = JSON.parse(JSON.stringify(this.propToolKV));
      if (
        this.toolKV.value.name === "" &&
        this.toolKV.value.description === ""
      ) {
        this.toolKV.key = uuidv4();
      }
    },
  },

  computed: {
    getBtnNextTxt: function (): string {
      return (
        this.workflow === "CriteriaFirst" &&
        ((this.propToolKV.value.criteriaSuitabilities &&
          this.propToolKV.value.criteriaSuitabilities.length > 0) ||
          (this.criteria && this.criteria.length > 0))
          ? "Next"
          : this.mode === Typ.simpleEditMode.Add
          ? "Add"
          : "Update"
      ) as string;
    },
  },

  //WATCH
  watch: {
    propToolKV: {
      handler() {
        this.updateToolKV();
      },
      deep: true,
    },
    showDialog: {
      handler() {
        this.isInSuitabilityCreation =
          this.forceSkipToSuitabilities && this.showDialog;
      },
    },
  },
});
</script>
