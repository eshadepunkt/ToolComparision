<template>
  <div id="PageManager">
    <Comparision v-show="currentPage === 'Comparision'" />
    <CriteriumListBox
      v-show="currentPage === 'Criteria'"
      :criteria="criteria"
      :workflow="workflow"
    />
    <ToolListBox
      v-show="currentPage === 'Tools'"
      :tools="tools"
      :criteria="criteria"
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
} from "@mdi/js";

import Vue from "vue";

import Comparision from "../Comparision/Comparision.vue";
import CriteriumListBox from "../Criterium/CriteriumListBox.vue";
import ToolListBox from "../Tool/ToolListBox.vue";

export default Vue.extend({
  name: "PageManager",

  components: {
    Comparision,
    CriteriumListBox,
    ToolListBox,
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
