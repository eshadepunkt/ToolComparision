<template>
  <v-card id="ComparisionDataIteratorCard" 
    :style="(result.score.isExcluded ? 'background-color: lightgrey; ' : '') + 'width: 20em'">
    <v-card-title class="subheading font-weight-bold">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">
            <v-row>
              <v-col cols="8">
                <div style="width: 15em">
                  {{ "RANK: " + result.rank.toString() }}
                  <br />
                  <br />
                  {{ result.toolKV.value.name }}
                  <br />
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
                      length="5"
                      size="1.5em"
                    >
                    </v-rating>
                  </div>
                </div>
              </v-col>
              <v-col cols="1">
                <div style="width: 2em">
                  <!-- Icons -->
                  <v-btn class="ma-2" icon @click="btnEdit()">
                    <v-icon>
                      {{ icons.mdiPencil }}
                    </v-icon>
                  </v-btn>
                </div>
              </v-col>
              <v-col cols="1">
                <div style="width: 2em">
                  <v-btn class="ma-2" icon @click="btnDelete()">
                    <v-icon>
                      {{ icons.mdiDelete }}
                    </v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </div>
        </template>
        <span>
          <v-card-text v-html="getToolInfo()" />
        </span>
      </v-tooltip>
    </v-card-title>

    <v-divider></v-divider>

    <div>
      <v-list dense
        :style="(result.score.isExcluded ? 'background-color: lightgrey; ' : '') + 'width: 20em'"
      >
        <ComparisionDataIteratorCardItem
          v-for="(suitability, index) in getSortedSuitabilities"
          :result="result"
          :propSuitabilityIndex="index"
          :sortBy="sortBy"
          :key="noSecHash(suitability)"
        />
      </v-list>
    </div>
    <ToolCreationDialog
      :showDialog="showDialog"
      :mode="editMode"
      :propToolKV="result.toolKV"
      :criteria="criteria"
      v-on:closeDialog="showDialog = false"
    />
  </v-card>
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
} from "@mdi/js";

import Vue from "vue";

import ComparisionDataIteratorCardItem from "./ComparisionDataIteratorCardItem.vue";
import ToolCreationDialog from "../Tool/ToolCreationDialog.vue";

export default Vue.extend({
  name: "ComparisionDataIteratorCard",

  components: {
    ComparisionDataIteratorCardItem,
    ToolCreationDialog,
  },

  props: {
    result: {
      type: Object as () => Typ.toolRating,
    },
    criteria: {
      type: Array as () => Array<Typ.criteriumKeyValue>,
    },
    sortBy: {
      type: String,
    },
  },

  //DATA
  data() {
    return {
      showDialog: false as boolean,
      editMode: Typ.simpleEditMode.Update,
      rating: ((this.result.score.currentValue / this.result.score.maxValue) * 5) as number,

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
