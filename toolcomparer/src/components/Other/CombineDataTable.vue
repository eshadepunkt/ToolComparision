<template>
  <div id="ToolDataTable">
    <div v-if="!tools || tools.length == 0">No data available</div>
    <v-simple-table v-else-if="workflow === 'ToolsFirst'">
      <template>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Number of connected Criteria</th>
            <th>Names of connected Criteria</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <ToolDataTableRow
            v-for="tool in tools"
            :key="noSecHash(tool)"
            :workflow="'CriteriaFirst'"
            :editMode="
              !(
                tool.value.criteriaSuitabilities &&
                tool.value.criteriaSuitabilities.length !== 0
              )
                ? Typ.simpleEditMode.Add
                : Typ.simpleEditMode.Update
            "
            :propToolKV="tool"
            :criteria="criteria"
            class="text-left"
          />
        </tbody>
      </template>
    </v-simple-table>
    <v-simple-table v-else-if="workflow === 'CriteriaFirst'">
      <template>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Importance</th>
            <th>Is Exclusion Criterium</th>
            <th>Number of connected Tools</th>
            <th>Names of connected Tools</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <CriteriumDataTableRow
            v-for="criterium in criteria"
            :key="noSecHash(criterium)"
            :propCriteriumKV="criterium"
            :workflow="'ToolsFirst'"
            :editMode="Typ.simpleEditMode.Add"
            :tools="tools"
            :showConnectedTools="true"
            class="text-left"
          />
        </tbody>
      </template>
    </v-simple-table>
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

import ToolDataTableRow from "../Tool/ToolDataTableRow.vue";
import ToolCreationDialog from "../Tool/ToolCreationDialog.vue";
import CriteriumDataTableRow from "../Criterium/CriteriumDataTableRow.vue";
import CriteriumCreationDialog from "../Criterium/CriteriumCreationDialog.vue";

export default Vue.extend({
  name: "ToolDataTable",

  components: {
    ToolDataTableRow,
    ToolCreationDialog,
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
      Typ,
      noSecHash,
      editMode: Typ.simpleEditMode.Add,
    };
  },

  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
  },

  //COMPUTED
  computed: {
    getTools: function (): Array<Typ.toolKeyValue> {
      return this.tools;
    },
  },
});
</script>
