<template>
  <div id="ToolListBox">
    <v-list>
      <v-item-group>
        <v-item v-for="item in getTools" :key="noSecHash(item)">
          <ToolListItem :propToolKV="item" />
        </v-item>
      </v-item-group>
    </v-list>
    <ToolLastCreationDialog
      v-if="workflow === 'CriteriaFirst'"
      :showDialog="showDialog"
      :mode="editMode"
      v-on:closeDialog="closeDialog()"
    />
  </div>
</template>

<script lang="ts">
import { v4 as uuidv4 } from "uuid";
import { NIL as uuidNIL } from "uuid";
import { sha1 as noSecHash } from "object-hash";

import * as Typ from "../../types/index";
import {
  mdiAccount,
  mdiPencil,
  mdiShareVariant,
  mdiDelete,
  mdiAppleKeyboardControl,
} from "@mdi/js";

import Vue from "vue";

import ToolListItem from "./ToolListItem.vue";
import ToolLastCreationDialog from "./ToolLastCreationDialog.vue";

export default Vue.extend({
  name: "ToolListBox",

  components: {
    ToolListItem,
    ToolLastCreationDialog,
  },

  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    workflow: {
      type: String,
      default: "CriteriaFirst",
    },
    tools: {
      type: Array as () => Array<Typ.toolKeyValue>,
    },
    criteria: {
      type: Array as () => Array<Typ.criteriumKeyValue>,
    },
  },

  //DATA
  data() {
    return {
      uuidNIL,
      noSecHash,
      editMode: Typ.simpleEditMode.Add,
    };
  },

  //COMPUTED
  computed: {
    getTools: function (): Array<Typ.toolKeyValue> {
      return this.tools;
    },
  },
});
</script>
