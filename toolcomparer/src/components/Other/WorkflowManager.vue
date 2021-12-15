<template>
  <div id="WorkflowManager">
    <CriteriumListBox
      v-if="currentListBox === 'Criteria'"
      :criteria="criteria"
      :showDialog="showDialog"
      :workflow="workflow"
      v-on:closeDialog="closeDialog()"
    />
    <ToolListBox
      v-else-if="currentListBox === 'Tools'"
      :tools="tools"
      :criteria="criteria"
      :showDialog="showDialog"
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
} from "@mdi/js";

import Vue from "vue";

import CriteriumListBox from "../Criterium/CriteriumListBox.vue";
import ToolListBox from "../Tool/ToolListBox.vue";

export default Vue.extend({
  name: "WorkflowManager",

  components: {
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
    },
    currentListBox: {
      type: String,
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
