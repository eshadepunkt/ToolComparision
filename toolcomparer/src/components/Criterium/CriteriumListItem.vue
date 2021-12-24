<template>
  <div id="CriteriumListItem">
    <v-card>
      <v-container>
        <v-row>
          <v-col cols="10">
            <CriteriumCard
              :propCriteriumKV="propCriteriumKV"
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
    <CriteriumCreationDialog
      v-if="workflow === 'CriteriaFirst'"
      :showDialog="showDialog"
      :mode="editMode"
      :propCriteriumKV="propCriteriumKV"
      v-on:closeDialog="showDialog = false"
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
} from "@mdi/js";

import Vue from "vue";

import CriteriumCard from "./CriteriumCard.vue";
import CriteriumCreationDialog from "./CriteriumCreationDialog.vue";

export default Vue.extend({
  name: "CriteriumListItem",

  components: {
    CriteriumCard,
    CriteriumCreationDialog,
  },

  //PROPS
  props: {
    workflow: {
      type: String,
      default: "CriteriaFirst",
    },
    propCriteriumKV: {
      type: Object as () => Typ.criteriumKeyValue,
    },
  },

  //DATA
  data() {
    return {
      moduleState: Typ.simpleModuleState.minimized as Typ.simpleModuleState,
      showDialog: false as boolean,

      editMode: Typ.simpleEditMode.Update,

      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
      },
      Typ,
    };
  },

  //METHODS
  methods: {
    btnEdit() {
      this.showDialog = true;
    },
    btnDelete() {
      this.$store.commit("removeCriterium", this.propCriteriumKV);
    },
  },
});
</script>
