<template>
  <tr>
    <td>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">
            {{ result.toolKV.value.name }}
          </div>
        </template>
        <span>
          <v-card-text v-html="getToolInfo()" />
        </span>
      </v-tooltip>
    </td>
    <td>
      {{ result.score.currentValue + "/" + result.score.maxValue }}
    </td>
    <ComparisionDataTableRowItem
      v-for="(suitability, index) in getSortedSuitabilities"
      :result="result"
      :propSuitabilityIndex="index"
      :sortBy="sortBy"
      :key="suitability.criteriumKV.key"
    />
    <td>
      <v-row>
        <v-col cols="5">
          <v-btn class="ma-2" icon @click="btnEdit()">
            <v-icon>
              {{ icons.mdiPencil }}
            </v-icon>
          </v-btn>
        </v-col>
        <v-col cols="5">
          <v-btn class="ma-2" icon @click="btnDelete()">
            <v-icon>
              {{ icons.mdiDelete }}
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </td>
  </tr>
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
import ComparisionDataTableRowItem from "./ComparisionDataTableRowItem.vue";

export default Vue.extend({
  name: "ComparisionListBox",

  components: {
    ComparisionDataTableRowItem,
  },

  props: {
    result: {
      type: Object as () => Typ.toolRating,
    },
    sortBy: {
      type: String,
    },
    criteria: {
      type: Object as () => Array<Typ.criteriumKeyValue>,
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
    getToolInfo(): string {
      const text =
        "Description:<br/>" +
        this.result.toolKV.value.description +
        "<br/>Excluded: " +
        this.result.score.isExcluded;

      return text;
    },
    btnEdit() {
      const appendix: string = this.result.toolKV.key;
      this.navigateTo("/ToolCreation/Update/" + appendix);
    },
    btnDelete() {
      this.$store.commit("removeTool", this.result.toolKV);
    },

    navigateTo(route: string): void {
      this.$router.push(route);
    },
  },

  //COMPUTED
  computed: {
    //NOTE: Sort DESCending
    getSortedSuitabilities: function (): Array<Typ.toolCriteriumSuitability> {
      const unsorted: Array<Typ.toolCriteriumSuitability> =
        this.result.toolKV.value.criteriaSuitabilities;

      const sorted = unsorted.sort((a, b) => {
        if (
          a.criteriumKV.value.isExclusionCriterium ===
          b.criteriumKV.value.isExclusionCriterium
        ) {
          return (
            b.criteriumKV.value.importance - a.criteriumKV.value.importance
          );
        } else if (a.criteriumKV.value.isExclusionCriterium) {
          return -1;
        } else {
          return 1;
        }
      });

      return sorted;
    },
  },
});
</script>
