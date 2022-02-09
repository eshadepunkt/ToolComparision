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
        :style="
          getColor(result.score) +
          (result.score.isExcluded ? 'color: grey' : '')
        "
      >
        <div v-if="!$store.getters.getSettingsIsStarsInsteadOfNumbers">
          {{ result.score.currentValue + "/" + result.score.maxValue }}
        </div>
        <div v-else-if="$store.getters.getSettingsIsStarsInsteadOfNumbers">
          <v-rating
            :empty-icon="icons.mdiStarOutline"
            :full-icon="icons.mdiStar"
            :half-icon="icons.mdiStarHalfFull"
            v-model="rating"
            half-increments
            readonly
            dense
            x-small
            length="5"
            size="1.5em"
          >
          </v-rating>
        </div>
      </v-chip>
    </td>
    <ComparisionDataTableRowItem
      v-for="(suitability, index) in getSortedSuitabilities"
      :result="result"
      :propSuitabilityIndex="index"
      :sortBy="sortBy"
      :key="noSecHash(suitability)"
    />
    <td width="125">
      <v-row>
        <v-col cols="5">
          <v-btn class="ma-2" icon @click="btnEdit()">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">
                  {{ icons.mdiPencil }}
                </v-icon>
              </template>
              <span> Edit Tool and Suitabilities </span>
            </v-tooltip>
          </v-btn>
        </v-col>
        <v-col cols="5">
          <v-btn class="ma-2" icon @click="btnDelete()">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">
                  {{ icons.mdiClose }}
                </v-icon>
              </template>
              <span> Remove Suitabilities </span>
            </v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </td>
    <ToolCreationDialog
      :showDialog="showDialog"
      :mode="editMode"
      :propToolKV="result.toolKV"
      :criteria="criteria"
      v-on:closeDialog="showDialog = false"
    />
    <DeleteConfirmationDialog
      :showDialog="confirmationRequest"
      :deleteItem="'all suitabilities'"
      :deleteFrom="result.toolKV.value.name"
      v-on:deletionConfirmed="deleteItem"
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
  mdiStar,
  mdiStarOutline,
  mdiStarHalfFull,
  mdiClose,
} from "@mdi/js";

import Vue from "vue";
import ComparisionDataTableRowItem from "./ComparisionDataTableRowItem.vue";
import ToolCreationDialog from "../Tool/ToolCreationDialog.vue";
import DeleteConfirmationDialog from "../Other/DeleteConfirmationDialog.vue";

export default Vue.extend({
  name: "ComparisionDataTableRow",

  components: {
    ComparisionDataTableRowItem,
    ToolCreationDialog,
    DeleteConfirmationDialog,
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
      confirmationRequest: false as boolean,
      editMode: Typ.simpleEditMode.Update,
      rating:
        this.result.score.currentValue !== -1
          ? (this.result.score.currentValue / this.result.score.maxValue) * 5
          : (0 as number),

      uuidNIL,
      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
        mdiStar,
        mdiStarOutline,
        mdiStarHalfFull,
        mdiClose,
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
      this.confirmationRequest = true;
    },
    deleteItem(deleteItem: boolean) {
      if (deleteItem) {
        this.$store.commit(
          "removeAllSuitabilitiesFromTool",
          this.result.toolKV
        );
      }

      this.confirmationRequest = false;
    },
    getColor(score: Typ.score): string {
      if (!this.$store.getters.getSettingsIsColorChips) {
        return "background-color: white;";
      } else if (score.isExcluded) {
        return "background-color: lightgrey;";
      } else if (score.currentValue >= score.maxValue * 0.8) {
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
