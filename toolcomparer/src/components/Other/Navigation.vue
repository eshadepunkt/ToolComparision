<template>
  <div id="Navigation">
    <v-card
      style="position: relative; height: 100vh"
      class="overflow-hidden"
      color="grey lighten-5"
    >
      <v-container>
        <!-- Head -->
        <v-row>
          <v-col xl="12">
            <Header :headerText="currentPage" />
          </v-col>
        </v-row>

        <!-- Body -->
        <v-row>
          <v-col xl="12">
            <v-navigation-drawer permanent expand-on-hover absolute>
              <v-list nav>
                <v-list-item
                  link
                  class="px-2"
                  v-on:click.native="showSettings = true"
                >
                  <v-list-item-icon>
                    <v-icon>{{ icons.mdiCog }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title> Settings </v-list-item-title>
                </v-list-item>
                <v-list-item
                  link
                  class="px-2"
                  v-on:click.native="featuresDialog = true"
                >
                  <v-list-item-icon>
                    <v-icon>{{ icons.mdiDotsHorizontal }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title> More Features </v-list-item-title>
                </v-list-item>
                <v-divider> </v-divider>
                <v-list-item
                  link
                  class="px-2"
                  v-on:click.native="currentPage = 'Comparision'"
                >
                  <v-list-item-icon>
                    <v-icon>{{ icons.mdiHome }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title> Start </v-list-item-title>
                </v-list-item>
                <v-divider> </v-divider>
                <v-list-item link v-on:click.native="currentPage = 'Criteria'">
                  <v-list-item-content>
                    <v-list-item-title class="text-h6">
                      Criteria
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Manage Criteria
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item link v-on:click.native="currentPage = 'Tools'">
                  <v-list-item-content>
                    <v-list-item-title class="text-h6">
                      Tools
                    </v-list-item-title>
                    <v-list-item-subtitle> Manage Tools </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider> </v-divider>
                <v-list-item
                  link
                  class="px-2"
                  v-on:click.native="currentPage = 'Combine Data'"
                >
                  <v-list-item-icon>
                    <v-icon>{{ icons.mdiVectorCombine }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title> Combine Data </v-list-item-title>
                </v-list-item>
                <v-list-item
                  link
                  class="px-2"
                  v-on:click.native="
                    navigateTo(
                      '/Workflow/' + $store.getters.getSettingsWorkflow
                    )
                  "
                >
                  <v-list-item-icon>
                    <v-icon>{{ icons.mdiPlus }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title> Workflow </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-navigation-drawer>
            <v-card style="height: 85vh; overflow-y: auto">
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
      :caller="currentPage"
      v-on:closeFeatures="featuresDialog = false"
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
} from "@mdi/js";

import Vue from "vue";

import Header from "./Header.vue";
import NavigationManager from "./NavigationManager.vue";
import SettingsDialog from "./SettingsDialog.vue";
import FeaturesDialog from "./FeaturesDialog.vue";

export default Vue.extend({
  name: "Navigation",

  components: {
    Header,
    NavigationManager,
    SettingsDialog,
    FeaturesDialog,
  },

  //DATA
  data() {
    return {
      showDialog: false as boolean,
      showSettings: false as boolean,
      featuresDialog: false as boolean,
      importDialog: false as boolean,
      currentPage: "Comparision" as string,

      btnBackTxt: "" as string,
      btnNextTxt: "" as string,
      btnAddTxt: "" as string,
      btnAddNavi: "" as string,
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
      console.log("Criteria changes detected");
      return this.$store.getters.getCriteria;
    },
    getTools: function (): Array<Typ.toolKeyValue> {
      console.log("Tools changes detected");
      return this.$store.getters.getTools;
    },
  },
});
</script>
