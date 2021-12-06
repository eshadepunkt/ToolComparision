<template>
  <div id="CriteriumListBox">
    <WorkflowContainer :listboxFrom="listboxFrom">
      <v-list style="height: 72vh; overflow-y: auto">
        <v-item-group>
          <v-item v-for="item in getCriteria" :key="item.key">
            <CriteriumListItem :propCriteriumKV="item" />
          </v-item>
        </v-item-group>
      </v-list>
    </WorkflowContainer>
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

import WorkflowContainer from "../Other/WorkflowContainer.vue";
import CriteriumListItem from "./CriteriumListItem.vue";

export default Vue.extend({
  name: "CriteriumListBox",

  components: {
    CriteriumListItem,
    WorkflowContainer,
  },

  //DATA
  data() {
    return {
      listboxFrom: "Criteria" as string,
      uuidNIL,
      criteria: this.$store.getters.getCriteria as Array<Typ.criteriumKeyValue>,
    };
  },

  //COMPUTED
  computed: {
    getCriteria: function (): Array<Typ.criteriumKeyValue> {
      return this.criteria;
    },
  },
});
</script>
