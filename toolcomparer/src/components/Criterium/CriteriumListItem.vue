<template>
  <div id="CriteriumListItem">
    <v-card
      v-bind:style="unsavedChanges ? 'background-color: LavenderBlush' : ''"
    >
      <v-container>
        <v-row>
          <v-col cols="9">
            <CriteriumCard
              :propCriterium="criteriumKV.value"
              :propModuleState="moduleState"
              :propUnsavedChanges="unsavedChanges"
              @update_criterium="updateCriterium"
              @save_criterium="saveCriterium"
              @restore_criterium="restoreCriterium"
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
      criteriumKV: JSON.parse(
        JSON.stringify(this.propCriteriumKV)
      ) as Typ.criteriumKeyValue,
      moduleState: Typ.simpleModuleState.minimized as Typ.simpleModuleState,

      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
      },

      unsavedChanges: false as boolean,
      resetRequest: false as boolean,

      debug: true as boolean,
    };
  },

  //METHODS
  methods: {
    updateCriterium(newVal: Typ.criterium) {
      this.criteriumKV.value = newVal;

      if (!this.resetRequest) {
        this.unsavedChanges = true;
      } else {
        this.unsavedChanges = false;
        this.resetRequest = false;
      }
    },
    saveCriterium(newVal: Typ.criterium) {
      this.criteriumKV.value = newVal;

      this.$store.dispatch("updateCriterium", this.criteriumKV);

      this.unsavedChanges = false;
    },
    restoreCriterium() {
      this.resetRequest = true;
      this.criteriumKV = JSON.parse(
        JSON.stringify(this.propCriteriumKV)
      ) as Typ.criteriumKeyValue;
      this.unsavedChanges = false;
    },

    btnEdit() {
      const appendix: string = this.criteriumKV.key;
      this.navigateTo("/CriteriumCreation/Update/" + appendix);
    },
    btnDelete() {
      this.$store.commit("removeCriterium", this.criteriumKV);
    },

    navigateTo(route: string): void {
      this.$router.push(route);
    },
  },

  //WATCH
  watch: {
    propCriterium: {
      handler(newVal: Typ.criteriumKeyValue) {
        this.criteriumKV = newVal;

        //LOG
        console.log("CriteriumListItem: propCriteriumKV changed!");
      },
      deep: true,
    },
  },
});
</script>
