<template>
  <div id="PageManager">
    <Comparision v-show="currentPage === 'Comparision'" />
    <div>
      <WorkflowManager
        v-show="currentPage !== 'Comparision'"
        :currentDataTable="currentPage"
        :criteria="getCriteria"
        :tools="getTools"
        :showDialog="showDialog"
        :workflow="currentPage === 'Criteria' ? 'CriteriaFirst' : 'ToolsFirst'"
        v-on:closeDialog="closeDialog()"
      />
    </div>
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

import Comparision from "../Comparision/Comparision.vue";
import CriteriumDataTable from "../Criterium/CriteriumDataTable.vue";
import ToolDataTable from "../Tool/ToolDataTable.vue";
import WorkflowManager from "./WorkflowManager.vue";

export default Vue.extend({
  name: "PageManager",

  components: {
    Comparision,
    CriteriumDataTable,
    ToolDataTable,
    WorkflowManager,
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
  },

  //COMPUTED
  computed: {
    getCriteria: function (): Array<Typ.criteriumKeyValue> {
      return this.criteria;
    },
    getTools: function (): Array<Typ.toolKeyValue> {
      return this.tools;
    },
  },
});
</script>
