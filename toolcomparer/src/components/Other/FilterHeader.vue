<template>
  <div id="FilterHeader">
    <v-toolbar dark color="blue darken-3" class="mb-1">
      <div style="min-width: 30vw;">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-bind="attrs"
            v-on="on"
            v-model="hsearch"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            :label="lblSearch"
          >
          </v-text-field>
        </template>
        <span> Search for </span>
      </v-tooltip>
      </div>
      
      <template v-if="showSort" style="width: 60vw;">
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <div v-bind="attrs" v-on="on" style="width: 25vw;">
              <v-select
                v-model="hsortBy"
                flat
                solo-inverted
                hide-details
                :items="[''].concat(sortItems.map((x) => x.value.name))"
                prepend-inner-icon="mdi-sort"
                :label="lblSort"
              >
              </v-select>
            </div>
          </template>
          <span> Sort by </span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-btn-toggle v-model="hsortDesc" mandatory>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                large
                depressed
                color="blue"
                :value="false"
              >
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
            </template>
            <span> Sort Ascending </span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                large
                depressed
                color="blue"
                :value="true"
              >
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </template>
            <span> Sort Descending </span>
          </v-tooltip>
        </v-btn-toggle>
      </template>

      <v-spacer v-if="showViewSwitch"></v-spacer>
      <div style="width: 25px;" v-if="showViewSwitch">
      <v-col>
        <v-btn v-if="currentView !== 'DataIterator'" small icon @click="viewChanged('DataIterator')">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on">
                {{ icons.mdiViewColumn }}
              </v-icon>
            </template>
            <span> Card View </span>
          </v-tooltip>
        </v-btn>
        <v-btn v-else-if="currentView !== 'DataTable'" small icon @click="viewChanged('DataTable')">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on">
                {{ icons.mdiViewComfy }}
              </v-icon>
            </template>
            <span> Table View </span>
          </v-tooltip>
        </v-btn>
      </v-col>
      </div>
    </v-toolbar>
  </div>
</template>

<script lang="ts">
import * as Typ from "../../types/index";
import {
  mdiAccount,
  mdiPencil,
  mdiShareVariant,
  mdiDelete,
  mdiAppleKeyboardControl,
  mdiContentSaveEdit,
  mdiFileRestoreOutline,
  mdiViewColumn,
  mdiViewComfy,
} from "@mdi/js";

import Vue from "vue";

export default Vue.extend({
  name: "FilterHeader",

  props: {
    sortItems: {
      type: Array as () => Array<Typ.ISortItem>,
      default() {
        return new Array<Typ.ISortItem>();
      },
    },
    search: {
      type: String,
    },
    sortDesc: {
      type: Boolean,
    },
    sortBy: {
      type: String,
    },
    lblSearch: {
      type: String,
      default: "Search tool",
    },
    lblSort: {
      type: String,
      default: "Sort by criteria",
    },
    showSort: {
      type: Boolean,
      default: true,
    },
    showViewSwitch: {
      type: Boolean,
      default: false,
    },
    currentView: {
      type: String,
      default: "DataTable",
    },
  },

  data() {
    return {
      hsortItems: this.sortItems,
      hsearch: this.search,
      hsortDesc: this.sortDesc,
      hsortBy: this.sortBy,

      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
        mdiContentSaveEdit,
        mdiFileRestoreOutline,
        mdiViewColumn,
        mdiViewComfy,
      },
      Typ,
    };
  },

  methods: {
    viewChanged(newVal: string) {
       this.$emit("viewChanged", newVal);
    },
  },

  //WATCH
  watch: {
    search: function (newVal) {
      this.hsearch = newVal;
    },
    sortDesc: function (newVal) {
      this.hsortDesc = newVal;
    },
    sortBy: function (newVal) {
      this.hsortBy = newVal;
    },
    hsearch: function (newVal) {
      this.$emit("searchChanged", newVal);
    },
    hsortDesc: function (newVal) {
      this.$emit("sortDescChanged", newVal);
    },
    hsortBy: function (newVal) {
      this.$emit("sortByChanged", newVal);
    },
  },
});
</script>
