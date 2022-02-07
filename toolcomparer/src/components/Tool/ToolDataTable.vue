<template>
  <div id="ToolDataTable">
    <div v-if="!tools || tools.length == 0">No data available</div>
    <v-simple-table v-else>
      <template>
        <thead>
          <tr>
            <th v-on:click="changeSort('name')">
              <v-row>
                <v-col cols="9"> Name </v-col>
                <v-col cols="1">
                  <v-icon
                    v-if="'name' === sortBy"
                    class="ma-2"
                    v-bind:style="sortDesc ? 'transform: scaleY(-1);' : ''"
                    icon
                  >
                    {{ icons.mdiSort }}
                  </v-icon>
                </v-col>
              </v-row>
            </th>
            <th v-on:click="changeSort('description')">
              <v-row>
                <v-col cols="9"> Description </v-col>
                <v-col cols="1">
                  <v-icon
                    v-if="'description' === sortBy"
                    class="ma-2"
                    v-bind:style="sortDesc ? 'transform: scaleY(-1);' : ''"
                    icon
                  >
                    {{ icons.mdiSort }}
                  </v-icon>
                </v-col>
              </v-row>
            </th>
            <th v-on:click="changeSort('number-of-suitabilities')">
              <v-row>
                <v-col cols="9"> Number of Suitabilities </v-col>
                <v-col cols="1">
                  <v-icon
                    v-if="'number-of-suitabilities' === sortBy"
                    class="ma-2"
                    v-bind:style="sortDesc ? 'transform: scaleY(-1);' : ''"
                    icon
                  >
                    {{ icons.mdiSort }}
                  </v-icon>
                </v-col>
              </v-row>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <ToolDataTableRow
            v-for="tool in tools"
            :key="noSecHash(tool)"
            :workflow="workflow"
            :editMode="
              workflow === 'ToolsFirst'
                ? Typ.simpleEditMode.UpdateSingle
                : Typ.simpleEditMode.Update
            "
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
    sortDesc: {
      type: Boolean,
    },
    sortBy: {
      type: String,
    },
  },

  //DATA
  data() {
    return {
      uuidNIL,
      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
        mdiSort,
      },
      Typ,
      noSecHash,
      editMode: Typ.simpleEditMode.Add,
    };
  },

  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    changeSort(sortBy: string) {
      this.$emit("changeSort", sortBy);
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
