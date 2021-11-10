<template>
  <div id="ToolCriteriumSuitabilityListBox">
    <v-container>
        <v-row>
          <v-col xl="11">
            <v-list style="height: 72%; overflow-y: auto">
              <v-item-group>
                <v-item v-for="(suitability, index) in propToolKV.value.criteriaSuitabilities" :key="suitability.criteriumKV.key">
                  <ToolCriteriumSuitabilityListItem 
                    :propToolKV="suitability" 
                    :propSuitabilityIndex="index"
                  />
                </v-item>
              </v-item-group>
            </v-list>
          </v-col>
        </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
console.log("Load ToolCriteriumSuitabilityListBox.vue");

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

import ToolCriteriumSuitabilityListItem from "./ToolCriteriumSuitabilityListItem.vue";

export default Vue.extend({
  name: "ToolCriteriumSuitabilityListBox",

  components: {
    ToolCriteriumSuitabilityListItem,
  },

  props: {
    propToolKV: {
      type: Object as () => Array<Typ.toolCriteriumSuitability>,
    },
  },

  //DATA
  data() {
    return {
      uuidNIL,
    };
  },
});
</script>
