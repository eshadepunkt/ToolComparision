<template>
  <div id="CriteriumListItem">
    <v-card>
      <v-container>
        <v-row>
          <v-col cols="10">
            <CriteriumCard
              :propCriterium="propCriteriumKV.value"
              :propModuleState="moduleState"
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
console.log("Load CriteriumListItem.vue");

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

import CriteriumCard from "./CriteriumCard.vue";

export default Vue.extend({
  name: "CriteriumListItem",

  components: {
    CriteriumCard,
  },

  //PROPS
  props: {
    propCriteriumKV: {
      type: Object as () => Typ.criteriumKeyValue,
    },
    btnText: {
      type: String,
      default: "Add",
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
      const appendix: string = this.propCriteriumKV.key;
      this.navigateTo("/CriteriumCreation/Update/" + appendix);
    },
    btnDelete() {
      this.$store.commit("removeCriterium", this.propCriteriumKV);
    },

    navigateTo(route: string): void {
      this.$router.push(route);
    },
  },
});
</script>
