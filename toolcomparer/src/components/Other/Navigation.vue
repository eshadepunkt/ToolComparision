<template>
  <div class="ma-12 pa-12" id="Navigation">
    <v-card>
      <v-navigation-drawer
        permanent
        expand-on-hover
      >
        <v-list
          nav
        >
          <v-list-item link class="px-2">
              <v-list-item-icon>
                <v-icon>mdiDotsHorizontal</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                More Features
              </v-list-item-title>
            </v-list-item>
            <v-list-item link class="px-2">
              <v-list-item-icon>
                <v-icon>mdiCog</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                Settings
              </v-list-item-title>
            </v-list-item>
            <v-divider> </v-divider>
              <v-list-item link class="px-2">
                <v-list-item-icon>
                  <v-icon>mdiPlus</v-icon>
                </v-list-item-icon>
                <v-list-item-title>
                  New Workflow
                </v-list-item-title>
            </v-list-item>
            <v-divider> </v-divider>
            <v-list-item link class="px-2">
              <v-list-item-icon>
                <v-icon>mdiHome</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                Start
              </v-list-item-title>
            </v-list-item>
          <v-divider> </v-divider>
          <v-list-item link>
            <v-list-item-content>
                <v-list-item-title class="text-h6">
                  Criteria
                </v-list-item-title>
                <v-list-item-subtitle>
                  Manage Criteria
                </v-list-item-subtitle>
              </v-list-item-content>
          </v-list-item>
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title class="text-h6">
                Tools
              </v-list-item-title>
              <v-list-item-subtitle>
                Manage Tools
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
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

export default Vue.extend({
  name: "Navigation",

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
