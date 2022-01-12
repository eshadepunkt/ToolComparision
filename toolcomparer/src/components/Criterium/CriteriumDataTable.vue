<template>
  <div id="CriteriumDataTable">
    <div v-if="!criteria || criteria.length == 0">No data available</div>
    <v-simple-table v-else>
      <template>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Importance</th>
            <th>Is Exclusion Criterium</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <CriteriumDataTableRow
            v-for="criterium in criteria"
            :key="noSecHash(criterium)"
            :propCriteriumKV="criterium"
            :workflow="workflow"
            :tools="tools"
            class="text-left"
          />
        </tbody>
      </template>
    </v-simple-table>
    <CriteriumCreationDialog
      :showDialog="showDialog"
      :mode="editMode"
      :workflow="workflow"
      :tools="tools"
      v-on:closeDialog="closeDialog()"
    />
  </div>
</template>

<script lang="ts">
import { NIL as uuidNIL } from "uuid";
import { sha1 as noSecHash } from "object-hash";

import * as Typ from "../../types/index";
import {
  mdiAccount,
  mdiPencil,
  mdiShareVariant,
  mdiDelete,
  mdiAppleKeyboardControl,
  mdiSort,
} from "@mdi/js";

import Vue from "vue";

import CriteriumDataTableRow from "./CriteriumDataTableRow.vue";
import CriteriumCreationDialog from "./CriteriumCreationDialog.vue";

export default Vue.extend({
  name: "CriteriumDataTable",

  components: {
    CriteriumDataTableRow,
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
