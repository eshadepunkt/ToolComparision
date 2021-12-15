<template>
  <div id="Workflow">
    <v-card min-height="100vh" color="grey lighten-5">
      <v-container>
        <!-- Head -->
        <v-row>
          <v-col xl="12">
            <Header :headerText="currentListBox" />
          </v-col>
        </v-row>

        <!-- Body -->
        <v-row>
          <v-col xl="12">
            <v-card style="height: 71vh; overflow-y: auto">
              <WorkflowManager
                :currentListBox="currentListBox"
                :criteria="getCriteria"
                :tools="getTools"
                :showDialog="showDialog"
                :workflow="workflow"
                v-on:closeDialog="closeDialog()"
              />
            </v-card>
          </v-col>
        </v-row>

        <!-- Buttons -->
        <v-row
          align="center"
          align-content="space-between"
          justify="space-between"
        >
          <v-col xl="1">
            <v-btn @click="navigateForward(false)" color="red lighten-5">
              {{ btnBackTxt }}
            </v-btn>
          </v-col>
          <v-col xl="1">
            <v-btn @click="showDialog = true" color="teal lighten-5">
              {{ btnAddTxt }}
            </v-btn>
          </v-col>
          <v-col xl="1">
            <v-btn @click="navigateForward()" color="blue lighten-5">
              {{ btnNextTxt }}
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

import Header from "./Header.vue";
import WorkflowManager from "./WorkflowManager.vue";

export default Vue.extend({
  name: "Workflow",

  components: {
    Header,
    WorkflowManager,
  },

  //DATA
  data() {
    return {
      currentListBox: "" as string,

      showDialog: false as boolean,
      workflow: "" as string,

      btnBackTxt: "" as string,
      btnNextTxt: "" as string,
      btnAddTxt: "" as string,
      btnAddNavi: "" as string,
      uuidNIL,
      Typ,
    };
  },

  //METHODS
  methods: {
    navigateTo(route: string): void {
      this.$router.push(route);
    },
    exporter() {
      let json = "";
      let filename = "";
      switch (this.currentListBox) {
        case "Criteria":
          {
            json = JSON.stringify(this.getTools);
            filename = "toolcomparer_tools.json";
          }
          break;
        case "Tools":
          {
            json = JSON.stringify(this.getCriteria);
            filename = "toolcomparer_criteria.json";
          }
          break;
      }

      let element = document.createElement("a");
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
    importer() {
      (this.$refs.uploader as Vue & { click: () => void }).click();
    },
    onFileChanged(e: any) {
      const file = e.target.files[0];
      if (e.target.value !== null) {
        let reader = new FileReader();
        let json: string | undefined;
        reader.onload = function () {
          json = reader.result?.toString();
          e.target.value = null;
        };
        reader.onloadend = () => this.convertJSONToArray(json);
        reader.readAsText(file);
      }
    },
    convertJSONToArray(json: string | undefined) {
      if (json !== undefined) {
        switch (this.currentListBox) {
          case "Criteria":
            {
              const tmpCriteria: Array<Typ.criteriumKeyValue> = JSON.parse(
                json
              ) as Array<Typ.criteriumKeyValue>;
              this.$store.dispatch("extendCriteria", tmpCriteria);
            }
            break;
          case "Tools":
            {
              const tmpTools: Array<Typ.toolKeyValue> = JSON.parse(
                json
              ) as Array<Typ.toolKeyValue>;
              this.$store.dispatch("extendTools", tmpTools);
            }
            break;
        }
      }
    },
    //Workflows:
    //CriteriaFirst: Start -> Criteria -> Tools -> Comparision
    //ToolsFirst: Start -> Tools -> Criteria -> Comparision
    navigateForward(forward = true) {
      const isListBoxCriteria: boolean = this.currentListBox === "Criteria";
      const isCriteriaFirst: boolean = this.workflow === "CriteriaFirst";

      const isComparisionNext =
        ((isCriteriaFirst && !isListBoxCriteria) ||
          (!isCriteriaFirst && isListBoxCriteria)) &&
        forward;
      const isStartBack =
        ((isCriteriaFirst && isListBoxCriteria) ||
          (!isCriteriaFirst && !isListBoxCriteria)) &&
        !forward;
      if (isComparisionNext || isStartBack) {
        this.navigateTo("/Comparision/DataIterator/");
      } else {
        const isToolsNext =
          isListBoxCriteria &&
          ((isCriteriaFirst && forward) || (!isCriteriaFirst && !forward));
        this.currentListBox = isToolsNext ? "Tools" : "Criteria";
      }

      this.updateButtonTexts();
    },
    updateButtonTexts() {
      const isListBoxCriteria: boolean = this.currentListBox === "Criteria";
      const isCriteriaFirst: boolean = this.workflow === "CriteriaFirst";

      const isComparisionNext =
        (isCriteriaFirst && !isListBoxCriteria) ||
        (!isCriteriaFirst && isListBoxCriteria);
      const isStartBack =
        (isCriteriaFirst && isListBoxCriteria) ||
        (!isCriteriaFirst && !isListBoxCriteria);

      this.btnBackTxt = isStartBack
        ? "Start-Page"
        : isCriteriaFirst
        ? "Criteria"
        : "Tools";
      this.btnNextTxt = isComparisionNext
        ? "Comparision"
        : isCriteriaFirst
        ? "Tools"
        : "Criteria";

      this.btnAddTxt = isListBoxCriteria ? "Add Criterium" : "Add Tool";
      this.btnAddNavi =
        (isCriteriaFirst ? "/CriteriaFirst/" : "/ToolsFirst/") +
        (isListBoxCriteria ? "CriteriumCreation/" : "ToolCreation/");
    },
    closeDialog() {
      this.showDialog = false;
    },
  },
  //COMPUTED
  computed: {
    getCriteria: function (): Array<Typ.criteriumKeyValue> {
      console.log("Criteria changes detected");
      return this.$store.getters.getCriteria;
    },
    getTools: function (): Array<Typ.toolKeyValue> {
      console.log("Tools changes detected");
      return this.$store.getters.getTools;
    },
  },

  //MOUNTED
  mounted: function () {
    this.workflow = this.$route.params.workflow;

    const isCriteriaFirst: boolean = this.workflow === "CriteriaFirst";
    this.currentListBox = isCriteriaFirst ? "Criteria" : "Tools";

    this.updateButtonTexts();
  },
});
</script>
