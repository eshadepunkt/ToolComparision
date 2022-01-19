<template>
  <div id="PageManager">
    <Comparision v-show="currentPage === 'Comparision'" height="80vh" />
    <div v-show="currentPage === 'Criteria' || currentPage === 'Tools'">
      <WorkflowManager
        height="80vh"
        :currentDataTable="currentPage"
        :criteria="getCriteria"
        :tools="getTools"
        :showDialog="showDialog"
        :workflow="currentPage === 'Criteria' ? 'CriteriaFirst' : 'ToolsFirst'"
        v-on:closeDialog="showDialog = false"
      />
      <v-btn
        @click="showDialog = true"
        class="rounded-circle"
        height="66"
        width="66"
        style="position: absolute; bottom: 50px; right: 25px"
      >
        <v-icon>{{ icons.mdiPlus }}</v-icon>
      </v-btn>
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

export default Vue.extend({
  name: "PageManager",

  components: {
    Comparision,
    CriteriumDataTable,
    ToolDataTable,
    WorkflowManager,
    CombineDataTable,
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
      showDialog: false as boolean,
    };
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
