<template>
  <div class="ma-12 pa-12" id="Navigation">
    
          <v-card>
            <v-container>
      <v-row>
        <v-col>
            <v-navigation-drawer permanent expand-on-hover>
              <v-list nav>
                <v-list-item link class="px-2">
                  <v-list-item-icon>
                    <v-icon>{{ icons.mdiDotsHorizontal }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title> More Features </v-list-item-title>
                </v-list-item>
                <v-list-item link class="px-2">
                  <v-list-item-icon>
                    <v-icon>{{ icons.mdiCog }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title> Settings </v-list-item-title>
                </v-list-item>
                <v-divider> </v-divider>
                <v-list-item link class="px-2">
                  <v-list-item-icon>
                    <v-icon>{{ icons.mdiPlus }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title> New Workflow </v-list-item-title>
                </v-list-item>
                <v-divider> </v-divider>
                <v-list-item link class="px-2" @click="currentPage = 'Start'">
                  <v-list-item-icon>
                    <v-icon>{{ icons.mdiHome }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title> Start </v-list-item-title>
                </v-list-item>
                <v-divider> </v-divider>
                <v-list-item link @click="currentPage = 'Criteria'">
                  <v-list-item-content>
                    <v-list-item-title class="text-h6"> Criteria </v-list-item-title>
                    <v-list-item-subtitle> Manage Criteria </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item link @click="currentPage = 'Tools'">
                  <v-list-item-content>
                    <v-list-item-title class="text-h6"> Tools </v-list-item-title>
                    <v-list-item-subtitle> Manage Tools </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-navigation-drawer>
            </v-col>
        <v-col>
            <PageManager
            :criteria="getCriteria"
            :tools="getTools"
            :currentPage="currentPage"
          />
          
          
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
  mdiCog,
  mdiMenu,
  mdiHome,
  mdiPlus,
  mdiDotsHorizontal,
} from "@mdi/js";

import Vue from "vue";

import PageManager from "./NavigationManager.vue";

export default Vue.extend({
  name: "Navigation",

  components: {
    PageManager,
  },

  //DATA
  data() {
    return {
      showDialog: false as boolean,
      currentPage: "Start" as string,

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
