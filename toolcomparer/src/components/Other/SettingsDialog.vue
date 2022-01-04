<template>
  <v-dialog
    v-model="showSettings"
    height="50vh"
    width="33vw"
    persistent
    transition="dialog-bottom-transition"
    id="Settings"
  >
    <v-card class="overflow-hidden">
      <v-app-bar
        absolute
        scroll-target="#scrolling-techniques-4"
        style="position: relative;"
      >
        <v-toolbar-title>Settings</v-toolbar-title>
        <v-btn style="position: absolute; right: 1em; top: 0em" icon @click="closeSettings()" >
          <v-icon>{{ icons.mdiClose }}</v-icon>
        </v-btn>

        <template v-slot:extension>
          <v-tabs align-with-title>
            <v-tab @click="isWorkflow = true">Workflow</v-tab>
            <v-tab @click="isWorkflow = false">Comparision</v-tab>
          </v-tabs>
        </template>
      </v-app-bar>
      <v-sheet id="scrolling-techniques-4" class="overflow-y-auto">
        <v-container v-show="isWorkflow" style="height: 40vh">
          <v-row>
            <v-col>
              <v-select
                :items="workflows"
                label="Workflow"
                v-model="selectedWorkflow"
                :rules="rules.str"
                required
              >
              </v-select>
            </v-col>
          </v-row>
          <v-spacer> </v-spacer>
          <v-row>
            <v-col>
              <v-switch
                v-model="isDescriptionMandatory"
                :label="'Description mandatory'"
              >
              </v-switch>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-switch
                v-model="isJustificationMandatory"
                :label="'Justification mandatory'"
              >
              </v-switch>
            </v-col>
          </v-row>
        </v-container>
        <v-container v-show="!isWorkflow" style="height: 40vh">
          <v-row>
            <v-col>
              <v-switch v-model="isColorChips" :label="'Color chips'">
              </v-switch>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-switch
                v-model="isColorChipsScoreOnly"
                :label="'Color chips on score only'"
                :disabled="!isColorChips"
              >
              </v-switch>
            </v-col>
          </v-row>
          <v-spacer> </v-spacer>
          <v-row>
            <v-col>
              <v-switch
                v-model="isStarsInsteadOfNumbers"
                :label="'Show stars intead of numbers'"
              >
              </v-switch>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
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
  name: "Settings",

  props: {
    showSettings: {
      type: Boolean,
      default: false,
    },
  },

  //DATA
  data() {
    return {
      workflows: ["ToolsFirst", "CriteriaFirst"] as string[],
      selectedWorkflow: JSON.parse(
        JSON.stringify(this.$store.getters.getSettingsWorkflow)
      ) as string,
      isDescriptionMandatory: JSON.parse(
        JSON.stringify(this.$store.getters.getSettingsIsDescriptionMandatory)
      ) as boolean,
      isJustificationMandatory: JSON.parse(
        JSON.stringify(this.$store.getters.getSettingsIsJustificationMandatory)
      ) as boolean,
      isColorChips: JSON.parse(
        JSON.stringify(this.$store.getters.getSettingsIsColorChips)
      ) as boolean,
      isColorChipsScoreOnly: JSON.parse(
        JSON.stringify(this.$store.getters.getSettingsIsColorChipsScoreOnly)
      ) as boolean,
      isStarsInsteadOfNumbers: JSON.parse(
        JSON.stringify(this.$store.getters.getSettingsIsStarsInsteadOfNumbers)
      ) as boolean,

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
    closeSettings() {
      this.$emit("closeSettings");
    },
  },

  watch: {
    selectedWorkflow: function (workflow: string): void {
      this.$store.commit("setSettingsWorkflow", workflow);
    },
    isDescriptionMandatory: function (isMandatory: boolean) {
      this.$store.commit("setSettingsIsDescriptionMandatory", isMandatory);
    },
    isJustificationMandatory: function (isMandatory: boolean) {
      this.$store.commit("setSettingsIsJustificationMandatory", isMandatory);
    },
    isColorChips: function (isColored: boolean) {
      this.$store.commit("setSettingsIsColorChips", isColored);
    },
    isColorChipsScoreOnly: function (isColored: boolean) {
      this.$store.commit("setSettingsIsColorChipsScoreOnly", isColored);
    },
    isStarsInsteadOfNumbers: function (isStars: boolean) {
      this.$store.commit("setSettingsIsStarsInsteadOfNumbers", isStars);
    },
  },
});
</script>
