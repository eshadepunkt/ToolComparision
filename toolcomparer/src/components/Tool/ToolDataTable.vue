<template>
  <div id="ToolDataTable">
    <div v-if="!tools || tools.length == 0">No data available</div>
    <v-simple-table v-else>
      <template>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Number of Suitabilities</th>
            <th>Names of Suitabilities</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <ToolDataTableRow
            v-for="tool in tools"
            :key="noSecHash(tool)"
            :workflow="workflow"
            :editMode="workflow === 'ToolsFirst' ? Typ.simpleEditMode.UpdateSingle : Typ.simpleEditMode.Update"
            :propToolKV="tool"
            :criteria="criteria"
            class="text-left"
          />
        </tbody>
      </template>
    </v-simple-table>
    <ToolCreationDialog
      :showDialog="showDialog"
      :mode="editMode"
      :workflow="workflow"
      :criteria="criteria"
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

import ToolDataTableRow from "./ToolDataTableRow.vue";
import ToolCreationDialog from "./ToolCreationDialog.vue";

export default Vue.extend({
  name: "ToolDataTable",

  components: {
    ToolDataTableRow,
    ToolCreationDialog,
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
