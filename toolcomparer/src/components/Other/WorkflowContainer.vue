<template>
  <div id="WorkflowContainer">
    <v-card min-height="100vh" color="grey lighten-5">
      <v-container>
        <!-- Head -->
        <v-row>
          <v-col xl="12">
            <v-card color="indigo darken-4">
              <h1 style="text-align: center; color: white">
                {{ listboxFrom }}
              </h1>
            </v-card>
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
            <v-btn @click="navigateTo(btnBackNavi)" color="red lighten-5">
              {{ btnBackTxt }}
            </v-btn>
          </v-col>
          <v-col xl="1">
            <v-btn
              @click="navigateTo(btnAddNavi + '/Add/' + uuidNIL)"
              color="teal lighten-5"
            >
              {{ btnAddTxt }}
            </v-btn>
          </v-col>
          <v-col xl="1">
            <v-btn @click="navigateTo(btnNextNavi)" color="blue lighten-5">
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

export default Vue.extend({
  name: "WorkflowContainer",

  props: {
    listboxFrom: {
      type: String,
    },
  },

  //DATA
  data() {
    return {
      workflow: "" as string,
      btnBackTxt: "" as string,
      btnBackNavi: "" as string,
      btnNextTxt: "" as string,
      btnNextNavi: "" as string,
      btnAddTxt: "" as string,
      btnAddNavi: "" as string,
      uuidNIL,
      criteria: this.$store.getters.getCriteria as Array<Typ.criteriumKeyValue>,
      tools: this.$store.getters.getTools as Array<Typ.toolKeyValue>,
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
      switch (this.listboxFrom) {
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
        switch (this.listboxFrom) {
          case "Criteria": {
              const tmpCriteria: Array<Typ.criteriumKeyValue> = JSON.parse(
                json
              ) as Array<Typ.criteriumKeyValue>;
              this.$store.dispatch("extendCriteria", tmpCriteria);
            }    
            break;
          case "Tools": {
              const tmpTools: Array<Typ.toolKeyValue> = JSON.parse(
                json
              ) as Array<Typ.toolKeyValue>;
              this.$store.dispatch("extendTools", tmpTools);
            }
            break;
        }
      }
    },
  },
  //COMPUTED
  computed: {
    getCriteria: function (): Array<Typ.criteriumKeyValue> {
      return this.criteria;
    },
    getTools: function (): Array<Typ.toolKeyValue> {
      return this.tools;
    },
  },

  //MOUNTED
  mounted: function () {
    this.workflow = this.$route.params.workflow;

    switch (this.workflow) {
      case "CriteriaFirst":{
          const isListBoxCriteria: boolean = (this.listboxFrom === "Criteria");
          this.btnBackTxt =
            isListBoxCriteria
              ? "Start-page" 
              : "Change Criteria";
          this.btnBackNavi =
            isListBoxCriteria
              ? "/Start/"
              : "/Criteria/CriteriaFirst";
          this.btnNextTxt =
            isListBoxCriteria
             ? "Add Tools" 
             : "Comparision";
          this.btnNextNavi =
            isListBoxCriteria
              ? "/Tools/CriteriaFirst"
              : "/Comparision/DataIterator/";
          this.btnAddTxt =
            isListBoxCriteria 
              ? "Add Criterium" 
              : "Add Tool";
          this.btnAddNavi =
            isListBoxCriteria
              ? "/CriteriaFirst/CriteriumCreation"
              : "/CriteriaFirst/ToolCreation";
        }  
        break;
      case "ToolsFirst": {
        const isListBoxTools: boolean = (this.listboxFrom === "Tools");
          this.btnBackTxt =
            isListBoxTools 
              ? "Start-page" 
              : "Change Tools";
          this.btnBackNavi =
            isListBoxTools 
              ? "/Start/" 
              : "/Tools/CriteriaFirst";
          this.btnNextTxt =
            isListBoxTools 
              ? "Add Criteria" 
              : "Comparision";
          this.btnNextNavi =
            isListBoxTools
              ? "/Criteria/CriteriaFirst"
              : "/Comparision/DataIterator/";
          this.btnAddTxt =
            isListBoxTools 
              ? "Add Tool" 
              : "Add Criteria";
          this.btnAddNavi =
            isListBoxTools
              ? "/CriteriaFirst/ToolCreation"
              : "/CriteriaFirst/CriteriumCreation";
        }  
        break;
    }
  },
});
</script>
