<template>
  <div id="FilterHeader">
    <v-toolbar dark color="blue darken-3" class="mb-1">
      <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
      <v-text-field v-bind="attrs" v-on="on"
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
      <span>
        Search for
      </span>
    </v-tooltip>

      <template v-if="showSort" style="width: 66vw;">
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
          <span>
            Sort by
          </span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-btn-toggle v-model="hsortDesc" mandatory>
          <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" large depressed color="blue" :value="false">
            <v-icon>mdi-arrow-up</v-icon>
          </v-btn>
          </template>
          <span>
            Sort Ascending
          </span>
        </v-tooltip>
        <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" large depressed color="blue" :value="true">
            <v-icon>mdi-arrow-down</v-icon>
          </v-btn>
        </template>
          <span>
            Sort Descending
          </span>
        </v-tooltip>
        </v-btn-toggle>
      </template>

    </v-toolbar>
  </div>
</template>

<script lang="ts">
import * as Typ from "../../types/index";

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
  },

  data() {
    return {
      hsortItems: this.sortItems,
      hsearch: this.search,
      hsortDesc: this.sortDesc,
      hsortBy: this.sortBy,
      Typ,
    };
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
