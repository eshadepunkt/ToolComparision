<template>
<div id="ComparisionHeader">
   <v-toolbar dark color="blue darken-3" class="mb-1">
      <v-text-field
         v-model="search"
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
         v-model="sortBy"
         flat
         solo-inverted
         hide-details
         :items="[''].concat(sortItems.map((x) => x.value.name))"
         prepend-inner-icon="mdi-magnify"
         label="Sort by criteria"
      >
      </v-select>
      <v-spacer></v-spacer>
      <v-btn-toggle v-model="sortDesc" mandatory>
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
         return Array<Typ.criteriumKeyValue>();
      },
     }
  },

  //DATA
  data() {
    return {
      search: "",
      sortDesc: true,
      sortBy: "",
    };
  },

  //WATCH
  watch: {
     search: function(newVal) {
        this.$emit('searchChanged', newVal);
     },
     sortDesc: function(newVal) {
        this.$emit('sortDescChanged', newVal);
     },
     sortBy: function(newVal) {
        this.$emit('sortByChanged', newVal);
     },
  }
});
</script>