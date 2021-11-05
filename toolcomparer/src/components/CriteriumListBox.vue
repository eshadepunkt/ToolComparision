<template>
  <div id="CriteriumListBox">
    <v-card min-height="100vh" color="grey lighten-5">
      <v-container>
        <!-- Head -->
        <v-row>
          <v-col xl="11">
            <v-card color="indigo darken-4">
              <h1 style="text-align: center; color: white">Criteria</h1>
            </v-card>
          </v-col>
        </v-row>

        <!-- Body -->
        <v-row>
          <v-col xl="11">
            <v-list style="height: 72vh; overflow-y: auto">
              <v-item-group>
                <v-item v-for="item in getCriteria()" :key="item.key">
                  <CriteriumListItem :propCriteriumKV="item" />
                </v-item>
              </v-item-group>
            </v-list>
          </v-col>
        </v-row>

        <!-- Buttons -->
        <v-row
          align="center"
          align-content="space-between"
          justify="space-between"
        >
          <v-col xl="1">
            <v-btn @click="navigateTo('/Start/')" color="red lighten-5">
              Start-Site
            </v-btn>
          </v-col>
          <v-col xl="1">
            <v-btn
              @click="navigateTo('/CriteriumCreation/Add/' + uuidNIL)"
              color="teal lighten-5"
            >
              Add Criterium
            </v-btn>
          </v-col>
          <v-col xl="1">
            <v-btn @click="navigateTo('/Tools/')" color="blue lighten-5">
              Add Tools
            </v-btn>
          </v-col>
        </v-row>
        <v-row
          align="center"
          align-content="space-between"
          justify="space-between"
        >
          <v-col xl="1">
            <v-btn @click="importCriteria()"> Import </v-btn>
            <input
              ref="uploader"
              class="d-none"
              type="file"
              accept=".json"
              @change="onFileChanged"
            />
          </v-col>
          <v-col xl="1">
            <v-btn @click="exportCriteria()"> Export </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts">
console.log("Load CriteriumListBox.vue");

import { v4 as uuidv4 } from "uuid";
import { NIL as uuidNIL } from "uuid";

import * as Typ from "../types/index";
import {
  mdiAccount,
  mdiPencil,
  mdiShareVariant,
  mdiDelete,
  mdiAppleKeyboardControl,
} from "@mdi/js";

import Vue from "vue";

import CriteriumListItem from "./CriteriumListItem.vue";

export default Vue.extend({
  name: "CriteriumListBox",

  components: {
    CriteriumListItem,
  },

  //DATA
  data() {
    return {
      criteria: {} as Array<Typ.criteriumKeyValue>,
      uuidNIL,
    };
  },

  //METHODS
  methods: {
    navigateTo(route: string): void {
      this.$router.push(route);
    },
    getCriteria(): Array<Typ.criteriumKeyValue> {
      this.criteria = this.$store.getters.getCriteria;

      return this.criteria;
    },
    exportCriteria() {
      const json: string = JSON.stringify(this.criteria);
      const filename = "toolcomparer_criteria.json";

      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(json)
      );
      element.setAttribute("download", filename);

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    importCriteria() {
      (this.$refs.uploader as Vue & { click: () => void }).click();
    },
    onFileChanged(e: any) {
      const file = e.target.files[0];
      let reader = new FileReader();
      var json: string | undefined;
      reader.onload = function () {
        json = reader.result?.toString();
        
        //LOG
        console.log(json);
  
        e.target.value = null;
      };
      reader.onloadend = () => this.convertJSONToArray(json);
      reader.readAsText(file);
    },
    convertJSONToArray(json: string | undefined) {
      if (json !== undefined) {
        const tmpCriteria: Array<Typ.criteriumKeyValue> = JSON.parse(
          json
        ) as Array<Typ.criteriumKeyValue>;
        this.$store.dispatch("extendCriteria", tmpCriteria);
      }
    },
  },

  //MOUNTED
  mounted: function () {
    this.criteria = this.$store.getters.getCriteria;

    //LOG
    console.log("CriteriumCreation: Mounted");
  },
});
</script>
