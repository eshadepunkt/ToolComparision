<template>
  <div id="ToolLastCreation">
    <v-dialog
      v-if="!isInSuitabilityCreation"
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
            <v-col xl="12">
              <v-card color="indigo darken-4">
                <h1 style="text-align: center; color: white">
                  {{ Typ.convertEditModeEnumToString(mode) }} tool
                </h1>
              </v-card>
            </v-col>
          </v-row>
          <!-- Body -->
          <v-row>
            <v-col xl="12">
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
            <v-col xl="8"> </v-col>
            <v-col xl="1">
              <v-btn @click="btnCancel()" color="red lighten-5"> Cancel </v-btn>
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
                {{ btnText }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <ToolCriteriumSuitabilityCreationDialog
      v-if="isInSuitabilityCreation"
      ref="suit_creation"
      :propToolKV="toolKV"
      :mode="mode"
      :showDialog="showDialog"
      :criteria="criteria"
      v-on:closeDialog="saveAndCloseDialog"
    />
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
  name: "ToolLastCreation",

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
    propToolKV: {
      type: Object as () => Typ.toolKeyValue,
      default() {
        return {
          key: uuidv4() as string,
          value: {
            name: "",
            description: "",
            criteriaSuitabilities: Array<Typ.toolCriteriumSuitability>(),
          } as Typ.tool,
        } as Typ.toolKeyValue;
      },
    },
    criteria: {
      type: Array as () => Array<Typ.criteriumKeyValue>,
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

      btnText: "Next" as string,

      isInSuitabilityCreation: false as boolean,
    };
  },

  //METHODS
  methods: {
    btnCancel() {
      this.resetToolKV();
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

        if (saveAndCloseDialog) {
          this.saveAndCloseDialog();
        } else if (this.mode === Typ.simpleEditMode.Add) {
          this.isInSuitabilityCreation = true;
        }
      }
    },

    resetToolKV(): void {
      this.toolKV = {
        key: uuidv4() as string,
        value: {
          name: "",
          description: "",
          criteriaSuitabilities: Array<Typ.toolCriteriumSuitability>(),
        } as Typ.tool,
      };
    },
    saveAndCloseDialog(finished = true) {
      if (!finished) {
        this.isInSuitabilityCreation = false;
        return;
      }
      const updateSuitabilities: Array<Typ.toolCriteriumSuitability> = (
        this.$refs.suit_creation as Vue & {
          getSuitabilities: () => Array<Typ.toolCriteriumSuitability>;
        }
      ).getSuitabilities();
      if (
        this.mode !== Typ.simpleEditMode.Add ||
        this.criteria.length === updateSuitabilities.length
      ) {
        const propHash = this.noSecHash(this.propToolKV);
        const newHash = this.noSecHash(this.toolKV);
        if (propHash !== newHash) {
          (this.$refs.tool_card as Vue & { save: () => boolean }).save();
        }

        updateSuitabilities.forEach((element) => {
          this.$store.dispatch("updateToolSuitability", {
            toolKV: this.toolKV,
            criteriumSuitability: element,
          });
        });

        this.closeDialog();
      }
    },
    closeDialog() {
      this.isInSuitabilityCreation = false;
      this.$emit("closeDialog");
    },
  },
});
</script>
