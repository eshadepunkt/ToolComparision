<template>
  <div id="CriteriumListBox">
    <v-list>
      <v-item-group>
        <v-item v-for="item in getCriteria" :key="item.key">
          <CriteriumListItem :propCriteriumKV="item" />
        </v-item>
      </v-item-group>
    </v-list>
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

export default Vue.extend({
  name: "CriteriumListBox",

  components: {
    CriteriumListItem,
  },

  props: {
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

  //COMPUTED
  computed: {
    getCriteria: function (): Array<Typ.criteriumKeyValue> {
      return this.criteria;
    },
  },
});
</script>
