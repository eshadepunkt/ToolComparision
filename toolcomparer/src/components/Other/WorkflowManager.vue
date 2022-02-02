<template>
  <div id="WorkflowManager">
    <CriteriumDataTable
      v-show="currentDataTable === 'Criteria'"
      :criteria="criteria"
      :tools="tools"
      :showDialog="showDialog && currentDataTable === 'Criteria'"
      :workflow="workflow"
      v-on:closeDialog="closeDialog()"
    />
    <ToolDataTable
      v-show="currentDataTable === 'Tools'"
      :tools="tools"
      :criteria="criteria"
      :showDialog="showDialog && currentDataTable === 'Tools'"
      :workflow="workflow"
      v-on:closeDialog="closeDialog()"
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

import CriteriumDataTable from "../Criterium/CriteriumDataTable.vue";
import ToolDataTable from "../Tool/ToolDataTable.vue";

export default Vue.extend({
  name: "WorkflowManager",

  components: {
    CriteriumDataTable,
    ToolDataTable,
  },

  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    workflow: {
      type: String,
    },
    currentDataTable: {
      type: String,
    },
    criteria: {
      type: Array as () => Array<Typ.criteriumKeyValue>,
    },
    tools: {
      type: Array as () => Array<Typ.toolKeyValue>,
    },
    showWorkflowButtons: {
      type: Boolean,
      default: false,
    },
  },

  //DATA
  data() {
    return {
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
    };
  },

  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
});
</script>
