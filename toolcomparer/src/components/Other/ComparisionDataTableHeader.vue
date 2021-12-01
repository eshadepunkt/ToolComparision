<template>
  <th>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on">
          {{ criteriumKV.value.name }}
        </div>
      </template>
      <span>
        <v-card-text v-html="getCriteriumInfo()" />
      </span>
    </v-tooltip>
  </th>
</template>

<script lang="ts">
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

export default Vue.extend({
  name: "ComparisionListBox",

  props: {
    criteriumKV: {
      type: Object as () => Typ.criteriumKeyValue,
    },
  },

  //DATA
  data() {
    return {
      uuidNIL,
      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
      },
    };
  },

  methods: {
    getCriteriumInfo(): string {
      const text = "Description:<br/>" + this.criteriumKV.value.description;

      return text;
    },
  },
});
</script>
