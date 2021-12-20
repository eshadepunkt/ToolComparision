<template>
  <div id="WorkflowManager">
    <ComparisionDataIterator
      v-if="currentView === 'DataIterator'"
      :results="results"
      :criteria="criteria"
      :maxScore="maxScore"
      :search="search"
      :sortDesc="sortDesc"
      :sortBy="sortBy"
    />
    <ComparisionDataTable
      v-else-if="currentView === 'DataTable'"
      :results="results"
      :criteria="criteria"
      :maxScore="maxScore"
      :search="search"
      :sortDesc="sortDesc"
      :sortBy="sortBy"
      v-on:sortDescChanged="sortDescChanged"
      v-on:sortByChanged="sortByChanged"
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
} from "@mdi/js";

import Vue from "vue";

import ComparisionDataIterator from "./ComparisionDataIterator.vue";
import ComparisionDataTable from "./ComparisionDataTable.vue";

export default Vue.extend({
  name: "WorkflowManager",

  components: {
    ComparisionDataIterator,
    ComparisionDataTable,
  },

  props: {
    currentView: {
      type: String,
    },
    results: {
      type: Array as () => Array<Typ.toolRating>,
    },
    criteria: {
      type: Array as () => Array<Typ.criteriumKeyValue>,
    },

    maxScore: {
      type: Number,
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
  methods: {
    sortDescChanged(newVal: boolean) {
      this.$emit("sortDescChanged", newVal);
    },
    sortByChanged(newVal: string) {
      this.$emit("sortByChanged", newVal);
    },
  },
});
</script>
