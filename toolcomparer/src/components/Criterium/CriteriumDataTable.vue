<template>
  <div id="CriteriumDataTable">
    <div v-if="!criteria || criteria.length == 0">No data available</div>
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
            <th v-on:click="changeSort('importance')">
              <v-row>
                <v-col cols="9"> Importance </v-col>
                <v-col cols="1">
                  <v-icon
                    v-if="'importance' === sortBy"
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
          <CriteriumDataTableRow
            v-for="criterium in criteria"
            :key="noSecHash(criterium)"
            :propCriteriumKV="criterium"
            :workflow="workflow"
            :editMode="
              workflow === 'CriteriaFirst'
                ? Typ.simpleEditMode.UpdateSingle
                : Typ.simpleEditMode.Update
            "
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
    changeSort(sortBy: string) {
      this.$emit("changeSort", sortBy);
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
