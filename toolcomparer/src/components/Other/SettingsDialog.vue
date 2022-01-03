<template>
  <v-dialog
      v-model="showDialog"
      height="67vh"
      width="50vw"
      persistent
      transition="dialog-bottom-transition"
      id="Settings"
    >
    <v-card class="overflow-hidden">
    <v-app-bar
      absolute
      dark
      shrink-on-scroll
      prominent
      scroll-target="#scrolling-techniques-4"
    >
      <v-toolbar-title>Settings</v-toolbar-title>

      <template v-slot:extension>
        <v-tabs align-with-title>
          <v-tab @click="isWorkflow = true">Workflow</v-tab>
          <v-tab @click="isWorkflow = false">Comparision</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-sheet
      id="scrolling-techniques-4"
      class="overflow-y-auto"
    >
      <v-container v-show="isWorkflow" style="height: 50vh;">
         <v-row>
            <v-col>
               <v-select
              :items="workflows"
              label="Workflow"
              v-model="selectedWorkflow"
              :rules="rules.str"
              required
              @change="updateWorkflow(selectedWorkflow)"
            >
            </v-select>
            </v-col>
         </v-row>
         <v-row>
            <v-col>

            </v-col>
         </v-row>
         <v-row>
            <v-col>

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
} from "@mdi/js";

import Vue from "vue";

export default Vue.extend({
  name: "Settings",

  //DATA
  data() {
    return {
      workflows: [
            "ToolsFirst",
            "CriteriaFirst",
            ] as string[],
      selectedImportance: "ToolsFirst" as string,

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
      },
      Typ,

      isValid: true as boolean,
      isWorkflow: true as boolean,
    };
  },

  methods: {
     updateWorkflow(workflow: string): void {
      
    },
  }
});
</script>
