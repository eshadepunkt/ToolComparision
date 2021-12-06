<template>
  <th id="ComparisionDataTableHeader">
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-row>
          <v-col
            cols="9"
            v-bind="attrs"
            v-on="on"
            v-bind:style="
              criteriumKV.value.name === sortBy ? 'color: blue;' : ''
            "
          >
            {{
              criteriumKV.value.name +
              (criteriumKV.value.isExclusionCriterium ? " (!)" : "")
            }}
          </v-col>
          <v-col cols="1">
            <v-icon
              v-if="criteriumKV.value.name === sortBy"
              class="ma-2"
              v-bind:style="sortDesc ? 'transform: scaleY(-1);' : ''"
              icon
            >
              {{ icons.mdiSort }}
            </v-icon>
          </v-col>
        </v-row>
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
  mdiSort,
} from "@mdi/js";

import Vue from "vue";

export default Vue.extend({
  name: "ComparisionDataTableHeader",

  props: {
    criteriumKV: {
      type: Object as () => Typ.criteriumKeyValue,
    },
    sortBy: {
      type: String,
    },
    sortDesc: {
      type: Boolean,
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
        mdiSort,
      },
    };
  },

  methods: {
    getCriteriumInfo(): string {
      const text =
        "Description:<br/>" +
        this.criteriumKV.value.description +
        "<br/>Exclusion Criterium: " +
        this.criteriumKV.value.isExclusionCriterium;

      return text;
    },
  },
});
</script>
