<template>
   <v-dialog
    v-model="showDialog"
    height="100px"
    width="300px"
    persistent
    transition="dialog-bottom-transition"
    :retain-focus="false"
    id="Settings"
  >
    <v-card class="overflow-hidden">
      <v-alert type="Warning" color="red darken-5" :icon="icons.mdiAlert">
         <v-card-text v-html="getWarning()" />
      </v-alert>
         <v-row>
         <v-card-actions>
            <v-btn
               @click="closeDialog(true)"
               color="green lighten-5"
            >
               Yes
            </v-btn>
         </v-card-actions>
         <v-card-actions>
            <v-btn 
            @click="closeDialog(false)"
              color="red lighten-5"
            >
               No
            </v-btn>
        </v-card-actions>
         </v-row>
    </v-card>
   </v-dialog>
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
  mdiFileRestoreOutline,
  mdiClose,
  mdiAlert,
} from "@mdi/js";

import Vue from "vue";

export default Vue.extend({
  name: "Settings",

  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    deleteItem: {
      type: String,
    },
    deleteFrom: {
      type: String,
    },
  },

  //DATA
  data() {
    return {
      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
        mdiContentSaveEdit,
        mdiFileRestoreOutline,
        mdiClose,
        mdiAlert,
      },
      Typ,
    };
  },

  methods: {
    getWarning(): string {
      return "You are about to delete <br/>[" + this.deleteItem + "]<br/> from <br/>[" + this.deleteFrom + "]! <br/>Are you sure?";
    },
    closeDialog(confirmed: boolean) {
      this.$emit("deletionConfirmed", confirmed);
    },
  },
});
</script>