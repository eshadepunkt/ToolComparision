<template>
  <div id="ToolDataTable">
    <v-container fluid>
        <v-row>
          <v-col>
            <FilterHeader
              :sortItems="currentSortItems"
              :search="search"
              :sortDesc="sortDesc"
              :sortBy="sortBy"
              :lblSearch="
                workflow === 'CriteriaFirst' ? 'Search criterium' : 'Search tool'
              "
              :lblSort="'Sort by'"
              v-on:searchChanged="searchChanged"
              v-on:sortDescChanged="sortDescChanged"
              v-on:sortByChanged="sortByChanged"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card style="height: 60vh; overflow-y: auto">
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
                      v-for="tool in getFilteredTools"
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
                      :forceSkipToSuitabilities="true"
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
                      v-for="criterium in getFilteredCriteria"
                      :key="noSecHash(criterium)"
                      :propCriteriumKV="criterium"
                      :workflow="'ToolsFirst'"
                      :editMode="Typ.simpleEditMode.Add"
                      :tools="tools"
                      :showConnectedTools="true"
                      :forceSkipToSuitabilities="true"
                      class="text-left"
                    />
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    
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
import FilterHeader from "./FilterHeader.vue";

export default Vue.extend({
  name: "ToolDataTable",

  components: {
    ToolDataTableRow,
    ToolCreationDialog,
    CriteriumDataTableRow,
    CriteriumCreationDialog,
    FilterHeader,
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
      search: "",
      sortDesc: true,
      sortBy: "",

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

    searchChanged(val: string) {
      this.search = val;
    },
    sortDescChanged(val: boolean) {
      this.sortDesc = val;
    },
    sortByChanged(val: string) {
      this.sortBy = val;
    },
  },

  //COMPUTED
  computed: {
    currentSortItems: function (): Array<Typ.ISortItem> {
      if (this.workflow === "CriteriaFirst") {
        return new Array<Typ.ISortItem>(
          {
            key: "name",
            value: {
              name: "name",
            },
          } as Typ.ISortItem,
          {
            key: "importance",
            value: {
              name: "importance",
            },
          } as Typ.ISortItem
        );
      } else {
        return new Array<Typ.ISortItem>({
          key: "name",
          value: {
            name: "name",
          },
        } as Typ.ISortItem);
      }
    },
    getFilteredCriteria: function (): Array<Typ.criteriumKeyValue> {
      let unsorted: Array<Typ.criteriumKeyValue> = JSON.parse(
        JSON.stringify(this.criteria)
      );

      const filtered = unsorted.filter((x) =>
        Typ.stringContains(x.value.name, this.search)
      );

      const sortInt = this.sortDesc ? -1 : 1;

      if (this.sortBy !== "") {
        return filtered.sort(
          (a: Typ.criteriumKeyValue, b: Typ.criteriumKeyValue) => {
            if (this.sortBy === "name") {
              return a.value.name.localeCompare(b.value.name) * sortInt;
            }
            //else if (this.sortBy === "importance")
            else {
              if (
                a.value.isExclusionCriterium === b.value.isExclusionCriterium
              ) {
                let result: number =
                  (b.value.importance - a.value.importance) * -1 * sortInt;     

                return result !== 0
                  ? result
                  : a.value.name.localeCompare(b.value.name);
              } else if (a.value.isExclusionCriterium) {
                return 1 * sortInt;
              } else {
                return -1 * sortInt;
              }
            }
          }
        );
      }

      return filtered;
    },
    getFilteredTools: function (): Array<Typ.toolKeyValue> {
      let unsorted: Array<Typ.toolKeyValue> = JSON.parse(
        JSON.stringify(this.tools)
      );

      const filtered = unsorted.filter((x) =>
        Typ.stringContains(x.value.name, this.search)
      );

      const sortInt = this.sortDesc ? -1 : 1;

      if (this.sortBy === "name") {
        return filtered.sort((a: Typ.toolKeyValue, b: Typ.toolKeyValue) => {
          return a.value.name.localeCompare(b.value.name) * sortInt;
        });
      }

      return filtered;
    },
  },

  //WATCH
  watch: {
    workflow: function (newVal) {
      if (newVal === "ToolsFirst") {
        if (this.sortBy !== "" && this.sortBy !== "name") {
          this.sortBy = "";
        }
      }
    },
  },
});
</script>
