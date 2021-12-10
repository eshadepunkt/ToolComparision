<template>
  <div id="CriteriumListBox">
    <v-list>
      <v-item-group>
        <v-item v-for="item in getCriteria" :key="item.key">
          <CriteriumListItem :propCriteriumKV="item" :workflow="workflow" />
        </v-item>
      </v-item-group>
    </v-list>
    <CriteriumFirstCreationDialog
      v-if="workflow === 'CriteriaFirst'"
      :showDialog="showDialog"
      :btnText="'Add'"
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

import CriteriumListItem from "./CriteriumListItem.vue";
import CriteriumFirstCreationDialog from "./CriteriumFirstCreationDialog.vue";

export default Vue.extend({
  name: "CriteriumListBox",

  components: {
    CriteriumListItem,
    CriteriumFirstCreationDialog,
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
    criteria: {
      type: Array as () => Array<Typ.criteriumKeyValue>,
    },
  },

  //DATA
  data() {
    return {
      uuidNIL,
    };
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
  },
});
</script>
