<template>
  <tr id="ComparisionDataTableRow">
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
      <v-chip
        :style="getColor(result.score)"
      >
        {{ result.score.currentValue + "/" + result.score.maxValue }}
      </v-chip>
    </td>
    <ComparisionDataTableRowItem
      v-for="(suitability, index) in getSortedSuitabilities"
      :result="result"
      :propSuitabilityIndex="index"
      :sortBy="sortBy"
      :key="noSecHash(suitability)"
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
    <ToolLastCreationDialog
      :showDialog="showDialog"
      :mode="editMode"
      :propToolKV="result.toolKV"
      :criteria="criteria"
      v-on:closeDialog="showDialog = false"
    />
  </tr>
</template>

<script lang="ts">
import { NIL as uuidNIL } from "uuid";
import { sha1 as noSecHash } from "object-hash";

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
import ToolLastCreationDialog from "../Tool/ToolLastCreationDialog.vue";

export default Vue.extend({
  name: "ComparisionDataTableRow",

  components: {
    ComparisionDataTableRowItem,
    ToolLastCreationDialog,
  },

  props: {
    result: {
      type: Object as () => Typ.toolRating,
    },
    sortBy: {
      type: String,
    },
    criteria: {
      type: Array as () => Array<Typ.criteriumKeyValue>,
    },
  },

  //DATA
  data() {
    return {
      showDialog: false as boolean,
      editMode: Typ.simpleEditMode.Update,

      uuidNIL,
      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
      },
      noSecHash,
      Typ,
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
      this.showDialog = true;
    },
    btnDelete() {
      this.$store.commit("removeTool", this.result.toolKV);
    },
    getColor(score: Typ.score): string {
      if (score.currentValue >= score.maxValue * 0.8) {
        return "background-color: lightgreen;";
      } else if (score.currentValue >= score.maxValue * 0.6) {
        return "background-color: yellow;";
      } else {
        return "background-color: red;";
      }
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
