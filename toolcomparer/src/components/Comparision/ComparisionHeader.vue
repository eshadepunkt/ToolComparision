<template>
  <div id="ComparisionHeader">
    <v-toolbar dark color="blue darken-3" class="mb-1">
      <v-text-field
        v-model="hsearch"
        clearable
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="Search tool"
      >
      </v-text-field>
      <template v-if="$vuetify.breakpoint.mdAndUp">
        <v-spacer></v-spacer>
        <v-select
          v-model="hsortBy"
          flat
          solo-inverted
          hide-details
          :items="[''].concat(sortItems.map((x) => x.value.name))"
          prepend-inner-icon="mdi-magnify"
          label="Sort by criteria"
        >
        </v-select>
        <v-spacer></v-spacer>
        <v-btn-toggle v-model="hsortDesc" mandatory>
          <v-btn large depressed color="blue" :value="false">
            <v-icon>mdi-arrow-up</v-icon>
          </v-btn>
          <v-btn large depressed color="blue" :value="true">
            <v-icon>mdi-arrow-down</v-icon>
          </v-btn>
        </v-btn-toggle>
      </template>
    </v-toolbar>
  </div>
</template>

<script lang="ts">
import * as Typ from "../../types/index";

import Vue from "vue";

export default Vue.extend({
  name: "ComparisionHeader",

  props: {
    sortItems: {
      type: Array as () => Array<Typ.criteriumKeyValue>,
      default() {
        return new Array<Typ.criteriumKeyValue>();
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
