<template>
  <div id="PageManager">
    <Comparision v-show="currentPage === 'Comparision'" height="80vh" />
    <div v-show="currentPage === 'Criteria' || currentPage === 'Tools'">
      <v-container fluid>
        <v-row>
          <v-col>
            <FilterHeader
              :sortItems="currentSortItems"
              :search="search"
              :sortDesc="sortDesc"
              :sortBy="sortBy"
              :lblSearch="
                currentPage === 'Criteria' ? 'Search criterium' : 'Search tool'
              "
              :lblSort="'Sort by'"
              :showSort="false"
              v-on:searchChanged="searchChanged"
              v-on:sortDescChanged="sortDescChanged"
              v-on:sortByChanged="sortByChanged"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card style="height: 60vh; overflow-y: auto">
              <WorkflowManager
                :currentDataTable="currentPage"
                :criteria="getFilteredCriteria"
                :tools="getFilteredTools"
                :showDialog="showDialog"
                :workflow="
                  currentPage === 'Criteria' ? 'CriteriaFirst' : 'ToolsFirst'
                "
                :sortDesc="sortDesc"
                :sortBy="sortBy"
                v-on:sortDescChanged="sortDescChanged"
                v-on:sortByChanged="sortByChanged"
                v-on:closeDialog="showDialog = false"
              />
            </v-card>
            <v-btn
              @click="showDialog = true"
              class="rounded-circle"
              height="66"
              width="66"
              style="position: absolute; bottom: 10px; right: 25px"
            >
              <v-icon>{{ icons.mdiPlus }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <CombineDataTable
      v-show="currentPage === 'Combine Data'"
      :criteria="criteria"
      :tools="tools"
      :workflow="workflow"
    />
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
  mdiCog,
  mdiMenu,
  mdiHome,
  mdiPlus,
  mdiDotsHorizontal,
} from "@mdi/js";

import Vue from "vue";

import Comparision from "../Comparision/Comparision.vue";
import CriteriumDataTable from "../Criterium/CriteriumDataTable.vue";
import ToolDataTable from "../Tool/ToolDataTable.vue";
import WorkflowManager from "./WorkflowManager.vue";
import CombineDataTable from "./CombineDataTable.vue";
import FilterHeader from "./FilterHeader.vue";

export default Vue.extend({
  name: "PageManager",

  components: {
    Comparision,
    CriteriumDataTable,
    ToolDataTable,
    WorkflowManager,
    CombineDataTable,
    FilterHeader,
  },

  props: {
    workflow: {
      type: String,
      default: "CriteriaFirst",
    },
    currentPage: {
      type: String,
      default: "Comparision",
    },
    criteria: {
      type: Array as () => Array<Typ.criteriumKeyValue>,
    },
    tools: {
      type: Array as () => Array<Typ.toolKeyValue>,
    },
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

  //DATA
  data() {
    return {
      search: "",
      sortDesc: true,
      sortBy: "",

      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
        mdiCog,
        mdiMenu,
        mdiHome,
        mdiPlus,
        mdiDotsHorizontal,
      },
      showDialog: false as boolean,
    };
  },

  //COMPUTED
  computed: {
    currentSortItems: function (): Array<Typ.ISortItem> {
      if (this.currentPage === "Criteria") {
        return new Array<Typ.ISortItem>(
          {
            key: "name",
            value: {
              name: "name",
            },
          } as Typ.ISortItem,
          {
            key: "description",
            value: {
              name: "description",
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
        return new Array<Typ.ISortItem>(
          {
            key: "name",
            value: {
              name: "name",
            },
          } as Typ.ISortItem,
          {
            key: "description",
            value: {
              name: "description",
            },
          } as Typ.ISortItem
        );
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
            } else if (this.sortBy === "description") {
              return (
                a.value.description.localeCompare(b.value.description) * sortInt
              );
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

      const filtered = unsorted.filter(
        (x) =>
          Typ.stringContains(x.value.name, this.search) ||
          Typ.stringContains(x.value.description, this.search)
      );

      const sortInt = this.sortDesc ? -1 : 1;

      if (this.sortBy !== "") {
        return filtered.sort((a: Typ.toolKeyValue, b: Typ.toolKeyValue) => {
          if (this.sortBy === "description") {
            return (
              a.value.description.localeCompare(b.value.description) * sortInt
            );
          }
          //else if (this.sortBy === "name")
          else {
            return a.value.name.localeCompare(b.value.name) * sortInt;
          }
        });
      }

      return filtered;
    },
  },

  //WATCH
  watch: {
    currentPage: function (newVal) {
      if (newVal === "Tools") {
        if (this.sortBy !== "" && this.sortBy !== "name") {
          this.sortBy = "";
        }
      }
    },
  },
});
</script>
