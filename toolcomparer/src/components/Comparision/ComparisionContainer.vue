<template>
  <div id="ComparisionContainer">
    <v-card min-height="100vh" color="grey lighten-5">
      <v-container>
        <!-- Head -->
        <v-row>
          <v-col xl="12">
            <Header :headerText="'Comparision'" />
          </v-col>
        </v-row>

        <!-- Body -->
        <v-row>
          <v-col xl="12">
            <slot> </slot>
          </v-col>
        </v-row>

        <!-- Buttons -->
        <v-row
          align="center"
          align-content="space-between"
          justify="space-between"
        >
          <v-col xl="1">
            <v-btn
              @click="navigateTo('/Tools/CriteriumFirst')"
              color="red lighten-5"
            >
              Change Tools
            </v-btn>
          </v-col>
          <v-col xl="1">
            <v-btn @click="navigateTo(redirectTo)" color="blue lighten-5">
              Change View
            </v-btn>
          </v-col>
        </v-row>
        <v-row
          align="center"
          align-content="space-between"
          justify="space-between"
        >
          <v-col xl="1">
            <v-btn @click="importer()"> Import </v-btn>
            <input
              ref="uploader"
              class="d-none"
              type="file"
              accept=".json"
              @change="onFileChanged"
            />
          </v-col>
          <v-col xl="1">
            <v-btn @click="exporter()"> Export </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
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
} from "@mdi/js";

import Vue from "vue";

import Header from "../Other/Header.vue";
import ToolListItem from "../Tool/ToolListItem.vue";
import { filter } from "vue/types/umd";

export default Vue.extend({
  name: "ComparisionContainer",

  props: {
    redirectTo: {
      type: String,
    },
  },

  //METHODS
  methods: {
    navigateTo(route: string): void {
      this.$router.push(route);
    },
    exporter() {
      //TO DO
      //EXPORT
    },
    importer() {
      (this.$refs.uploader as Vue & { click: () => void }).click();
    },
    onFileChanged(e: any) {
      //TO DO
      //IMPORT
    },
    convertJSONToArray(json: string | undefined) {
      //TO DO
      //Convert IMPORT
    },
  },
});
</script>
