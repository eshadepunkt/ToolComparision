<template>
  <div id="CriteriumFirstCreation">
    <v-dialog
      v-model="showDialog"
      height="67vh"
      width="33vw"
      hide-overlay
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card color="grey lighten-5">
        <v-container>
          <!-- Head -->
          <v-row>
            <v-col xl="3">
              <v-card color="indigo darken-4">
                <h1 style="text-align: center; color: white">
                  {{ Typ.convertEditModeEnumToString(mode) }} Criterium
                </h1>
              </v-card>
            </v-col>
          </v-row>
          <!-- Body -->
          <v-row>
            <v-col xl="3">
              <v-card outlined>
                <CriteriumCard
                  ref="criterium_card"
                  :propCriteriumKV="propCriteriumKV"
                  :propModuleState="moduleState"
                />
              </v-card>
            </v-col>
          </v-row>
          <!-- Buttons -->
          <v-row>
            <v-col xl="2"> </v-col>
            <v-col xl="1">
              <v-btn @click="btnCancel()" color="red lighten-5"> Cancel </v-btn>
            </v-col>
            <v-col xl="1"> </v-col>
            <v-col xl="1">
              <v-btn @click="btnSave()" color="teal lighten-5">
                {{ Typ.convertEditModeEnumToString(mode) }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
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
  mdiContentSaveEdit,
} from "@mdi/js";

import Vue from "vue";

import CriteriumCard from "./CriteriumCard.vue";

export default Vue.extend({
  name: "CriteriumFirstCreation",

  components: {
    CriteriumCard,
  },

  //PROPS
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: Number as () => Typ.simpleEditMode,
      default: Typ.simpleEditMode.Add,
    },
    propCriteriumKV: {
      type: Object as () => Typ.criteriumKeyValue,
      default() {
        return {
          key: uuidv4() as string,
          value: {
            name: "",
            description: "",
            importance: Typ.criteriumImportance.undefined,
            isExclusionCriterium: false,
          } as Typ.criterium,
        } as Typ.criteriumKeyValue;
      },
    },
  },

  //DATA
  data() {
    return {
      moduleState: Typ.simpleModuleState.increation as Typ.simpleModuleState,

      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
        mdiContentSaveEdit,
      },
      Typ,
    };
  },

  //METHODS
  methods: {
    btnCancel() {
      this.closeDialog();
    },
    btnSave() {
      const isSuccessful: boolean = (
        this.$refs.criterium_card as Vue & { save: () => boolean }
      ).save();
      if (isSuccessful) {
        this.closeDialog();
      }
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
});
</script>
