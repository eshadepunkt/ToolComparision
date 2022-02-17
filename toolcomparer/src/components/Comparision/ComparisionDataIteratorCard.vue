<template>
  <v-hover v-slot="{ hover }">
    <v-card
      id="ComparisionDataIteratorCard"
      :style="
        (result.score.isExcluded ? 'background-color: lightgrey; ' : '') +
        'width: 16em'
      "
    >
      <v-card-title class="subheading font-weight-bold" v-on:click="btnEdit()">
        <div>
          <v-row>
            <v-col cols="8">
              <div style="width: 10em">
                {{ "RANK: " + result.rank.toString() }}
                <br />
                <br />
                {{ result.toolKV.value.name }}
                <br />
                <div v-if="!$store.getters.getSettingsIsStarsInsteadOfNumbers">
                  {{ result.score.currentValue + "/" + result.score.maxValue }}
                </div>
                <div
                  v-else-if="$store.getters.getSettingsIsStarsInsteadOfNumbers"
                >
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
            <v-col cols="1"> </v-col>
            <v-col cols="1">
              <div style="width: 2em">
                <v-btn class="ma-2" v-show="hover" icon @click="btnDelete()">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon v-bind="attrs" v-on="on">
                        {{ icons.mdiClose }}
                      </v-icon>
                    </template>
                    <span> Remove Suitabilities </span>
                  </v-tooltip>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <div>
        <v-list
          dense
          :style="
            (result.score.isExcluded ? 'background-color: lightgrey; ' : '') +
            'width: 16em'
          "
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
      <DeleteConfirmationDialog
        :showDialog="confirmationRequest"
        :deleteItem="'all suitabilities'"
        :deleteFrom="result.toolKV.value.name"
        v-on:deletionConfirmed="deleteItem"
      />
    </v-card>
  </v-hover>
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

import ComparisionDataIteratorCardItem from "./ComparisionDataIteratorCardItem.vue";
import ToolCreationDialog from "../Tool/ToolCreationDialog.vue";
import DeleteConfirmationDialog from "../Other/DeleteConfirmationDialog.vue";

export default Vue.extend({
  name: "ComparisionDataIteratorCard",

  components: {
    ComparisionDataIteratorCardItem,
    ToolCreationDialog,
    DeleteConfirmationDialog,
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
      if (!this.confirmationRequest) {
        this.showDialog = true;
      }
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
