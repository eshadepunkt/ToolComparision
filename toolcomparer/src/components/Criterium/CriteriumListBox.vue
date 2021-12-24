<template>
  <div id="CriteriumListBox">
    <div v-if="!getCriteria || getCriteria.length == 0">No data available</div>
    <v-list>
      <v-item-group>
        <v-item v-for="item in getCriteria" :key="noSecHash(item)">
          <CriteriumListItem :propCriteriumKV="item" :workflow="workflow" />
        </v-item>
      </v-item-group>
    </v-list>
    <CriteriumCreationDialog
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

import CriteriumListItem from "./CriteriumListItem.vue";
import CriteriumCreationDialog from "./CriteriumCreationDialog.vue";

export default Vue.extend({
  name: "CriteriumListBox",

  components: {
    CriteriumListItem,
    CriteriumCreationDialog,
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
    criteria: {
      type: Array as () => Array<Typ.criteriumKeyValue>,
    },
    tools: {
      type: Array as () => Array<Typ.toolKeyValue>,
    },
  },

  //DATA
  data() {
    return {
      uuidNIL,
      Typ,
      noSecHash,
      editMode: Typ.simpleEditMode.Add,
      currentTool: {} as Typ.toolKeyValue,
    };
  },

  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
  },

  //COMPUTED
  computed: {
    getCriteria: function (): Array<Typ.criteriumKeyValue> {
      return this.criteria;
    },
  },
});
</script>
