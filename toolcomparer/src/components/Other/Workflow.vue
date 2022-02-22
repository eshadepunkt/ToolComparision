<template>
  <v-dialog
    v-model="showBrainstorming"
    persistent
    transition="dialog-bottom-transition"
    height="100vh"
    width="60vw"
    :retain-focus="false"
    id="Settings"
  >
    <div id="Workflow">
      <v-card
        style="position: relative; height: 90vh; width: 60vw"
        color="grey lighten-5"
      >
        <v-container fluid>
          <!-- Head -->
          <v-row>
            <v-col style="position: absolute; width: 60vw">
              <Header :headerText="currentListBox" />
            </v-col>
          </v-row>

          <!-- Body -->
          <v-row style="position: absolute; left: 1vw; top: 50px; width: 58vw">
            <v-col>
              <v-card style="height: 75vh">
                <v-card style="height: 68vh; overflow-y: auto">
                  <WorkflowManager
                    :currentDataTable="currentListBox"
                    :criteria="getCriteria"
                    :tools="getTools"
                    :showDialog="showDialog"
                    :workflow="workflow"
                    v-on:closeDialog="closeDialog()"
                  />
                </v-card>
                <v-container fluid>
                  <!-- Buttons -->
                  <v-row
                    align="center"
                    align-content="space-between"
                    justify="space-between"
                  >
                    <v-card-actions>
                      <v-btn @click="navigateForward(false)" text>
                        {{ btnBackTxt }}
                      </v-btn>
                    </v-card-actions>
                    <v-card-actions>
                      <v-btn @click="showDialog = true" color="primary">
                        {{ btnAddTxt }}
                      </v-btn>
                    </v-card-actions>
                    <v-card-actions>
                      <v-btn @click="navigateForward()" color="secondary">
                        {{ btnNextTxt }}
                      </v-btn>
                    </v-card-actions>
                  </v-row>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </div>
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

  props: {
    showBrainstorming: {
      type: Boolean,
      default: false,
    },
    workflow: {
      type: String,
      default: "CriteriaFirst",
    },
  },

  //DATA
  data() {
    return {
      currentListBox: "" as string,

      showDialog: false as boolean,

      btnBackTxt: "" as string,
      btnNextTxt: "" as string,
      btnAddTxt: "" as string,
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
      console.log(this.currentListBox);
      switch (this.currentListBox) {
        case "Tools":
          {
            json = JSON.stringify(this.getTools);
            filename = "toolcomparer_tools.json";
          }
          break;
        case "Criteria":
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
        this.closeBrainstorming();
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
        ? "Close"
        : isCriteriaFirst
        ? "Criteria"
        : "Tools";
      this.btnNextTxt = isComparisionNext
        ? "Close"
        : isCriteriaFirst
        ? "Tools"
        : "Criteria";

      this.btnAddTxt = isListBoxCriteria ? "Add Criterium" : "Add Tool";
    },
    closeDialog() {
      this.showDialog = false;
    },
    closeBrainstorming() {
      const isCriteriaFirst: boolean = this.workflow === "CriteriaFirst";
      this.currentListBox = isCriteriaFirst ? "Criteria" : "Tools";

      this.updateButtonTexts();

      this.$emit("closeBrainstorming");
    },
  },
  //COMPUTED
  computed: {
    getCriteria: function (): Array<Typ.criteriumKeyValue> {
      return JSON.parse(JSON.stringify(this.$store.getters.getCriteria));
    },
    getTools: function (): Array<Typ.toolKeyValue> {
      return JSON.parse(JSON.stringify(this.$store.getters.getTools));
    },
  },

  watch: {
    workflow: {
      handler() {
        const isCriteriaFirst: boolean = this.workflow === "CriteriaFirst";
        this.currentListBox = isCriteriaFirst ? "Criteria" : "Tools";

        this.updateButtonTexts();
      },
    },
  },

  mounted: function() {
    const isCriteriaFirst: boolean = this.workflow === "CriteriaFirst";
        this.currentListBox = isCriteriaFirst ? "Criteria" : "Tools";

        this.updateButtonTexts();
  }
});
</script>
