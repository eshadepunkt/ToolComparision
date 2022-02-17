<template>
  <div id="Navigation">
    <v-card
      style="position: relative; height: 100vh; width: 100vw"
      class="overflow-hidden"
      color="grey lighten-5"
    >
      <v-container fluid>
        <!-- Head -->
        <v-row>
          <v-col style="position: absolute; width: 100vw">
            <v-toolbar
              flat
              dense
              tile
              floating
              absolute
              color="transparent"
              style="position: absolute; top: 10px; right: 10px"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    x-small
                    text
                    color="white"
                    v-on:click.native="showBrainstorming = true"
                  >
                    Brainstorming
                  </v-btn>
                </template>
                <span>
                  Starts a Worklow where criteria and tools can be created and
                  combined.
                  <br />
                  Under Settings you can change the Workflow and
                  Validation-Rules.
                </span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    x-small
                    text
                    color="white"
                    v-on:click.native="currentPage = 'Criteria'"
                  >
                    Criteria
                  </v-btn>
                </template>
                <span> Add or change criteria. </span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    x-small
                    text
                    color="white"
                    v-on:click.native="currentPage = 'Tools'"
                  >
                    Tools
                  </v-btn>
                </template>
                <span> Add or change tools. </span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    x-small
                    text
                    color="white"
                    v-on:click.native="currentPage = 'Comparision'"
                  >
                    Comparision
                  </v-btn>
                </template>
                <span>
                  Show Comparision of Tools.
                  <br />
                  Under "Change View" you can switch between card and table
                  design.
                </span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    class="px-2"
                    x-small
                    icon
                    color="white"
                    v-on:click.native="featuresDialog = true"
                  >
                    <v-icon>{{ icons.mdiSwapVertical }}</v-icon>
                  </v-btn>
                </template>
                <span> Import/Export data of the current page. </span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    class="px-2"
                    x-small
                    icon
                    color="white"
                    v-on:click.native="showSettings = true"
                  >
                    <v-icon>{{ icons.mdiCog }}</v-icon>
                  </v-btn>
                </template>
                <span>
                  Settings.
                  <br />
                  You can change Workflow, Validation-Rules and
                  Comparision-Design.
                </span>
              </v-tooltip>
            </v-toolbar>
            <Header :headerText="currentPage" />
          </v-col>
        </v-row>

        <!-- Body -->
        <v-row style="position: absolute; left: 1vw; top: 50px; width: 98vw">
          <v-col>
            <v-card style="height: 85vh">
              <NavigationManager
                :criteria="getCriteria"
                :tools="getTools"
                :currentPage="currentPage"
                :workflow="$store.getters.getSettingsWorkflow"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <SettingsDialog
      :showSettings="showSettings"
      v-on:closeSettings="showSettings = false"
    />
    <FeaturesDialog
      :featuresDialog="featuresDialog"
      v-on:closeFeatures="featuresDialog = false"
    />
    <Workflow
      :showBrainstorming="showBrainstorming"
      :workflow="$store.getters.getSettingsWorkflow"
      v-on:closeBrainstorming="showBrainstorming = false"
    />
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
  mdiCog,
  mdiMenu,
  mdiHome,
  mdiPlus,
  mdiDotsHorizontal,
  mdiVectorCombine,
  mdiSwapVertical,
} from "@mdi/js";

import Vue from "vue";

import Header from "./Header.vue";
import NavigationManager from "./NavigationManager.vue";
import SettingsDialog from "./SettingsDialog.vue";
import FeaturesDialog from "./FeaturesDialog.vue";
import Workflow from "./Workflow.vue";

export default Vue.extend({
  name: "Navigation",

  components: {
    Header,
    NavigationManager,
    SettingsDialog,
    FeaturesDialog,
    Workflow,
  },

  //DATA
  data() {
    return {
      showDialog: false as boolean,
      showSettings: false as boolean,
      featuresDialog: false as boolean,
      importDialog: false as boolean,
      showBrainstorming: false as boolean,
      currentPage: "Comparision" as string,

      btnBackTxt: "" as string,
      btnNextTxt: "" as string,
      btnAddTxt: "" as string,
      btnAddNavi: "" as string,

      isInitialized: false as boolean,

      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
        mdiCog,
        mdiMenu,
        mdiHome,
        mdiPlus,
        mdiDotsHorizontal,
        mdiVectorCombine,
        mdiSwapVertical,
      },
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

  //COMPUTED
  computed: {
    getCriteria: function (): Array<Typ.criteriumKeyValue> {
      return JSON.parse(JSON.stringify(this.$store.getters.getCriteria));
    },
    getTools: function (): Array<Typ.toolKeyValue> {
      const json: string = JSON.stringify(this.$store.getters.getTools);

      if (this.isInitialized) {
        window.localStorage.setItem("results", json);
      }

      return JSON.parse(json);
    },
  },

  mounted: function () {
    const results = window.localStorage.getItem("results");
    if (results !== null) {
      const tmpTools: Array<Typ.toolKeyValue> = JSON.parse(
        results
      ) as Array<Typ.toolKeyValue>;
      this.$store.dispatch("extendTools", tmpTools);
    }

    this.isInitialized = true;
  },
});
</script>
