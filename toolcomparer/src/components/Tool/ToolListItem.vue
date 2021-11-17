<template>
  <div id="ToolListItem">
    <v-card>
      <v-container>
        <v-row>
          <v-col cols="10">
            <ToolCard
              :propToolKV="propToolRating === undefined ? propToolKV : propToolRating.tool"
              :propModuleState="moduleState"
              :propToolRating="propToolRating"
            />
          </v-col>
          <!-- Icons -->
          <v-col cols="1">
            <v-btn class="ma-2" icon @click="btnEdit()">
              <v-icon>
                {{ icons.mdiPencil }}
              </v-icon>
            </v-btn>
          </v-col>
          <v-col cols="1">
            <v-btn class="ma-2" icon @click="btnDelete()">
              <v-icon>
                {{ icons.mdiDelete }}
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts">
console.log("Load ToolListItem.vue");

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

import ToolCard from "./ToolCard.vue";

export default Vue.extend({
  name: "ToolListItem",

  components: {
    ToolCard,
  },

  //PROPS
  props: {
    propToolKV: {
      type: Object as () => Typ.toolKeyValue,
    },
    btnText: {
      type: String,
      default: "Add",
    },

    propToolRating: {
      type: Object as () => Typ.toolRating,
      default: undefined,
    },
  },

  //DATA
  data() {
    return {
      moduleState: Typ.simpleModuleState.minimized as Typ.simpleModuleState,

      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
      },

      debug: true as boolean,
    };
  },

  //METHODS
  methods: {
    btnEdit() {
      const appendix: string = this.propToolKV.key;
      this.navigateTo("/ToolCreation/Update/" + appendix);
    },
    btnDelete() {
      this.$store.commit("removeTool", this.propToolKV);
    },

    navigateTo(route: string): void {
      this.$router.push(route);
    },
  },
});
</script>
