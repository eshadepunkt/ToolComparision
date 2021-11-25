<template>
  <v-card style="width: 20em;">
    <v-card-title class="subheading font-weight-bold">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">
            <v-row>
              <v-col cols="8">
                <div style="width: 15em;">
                  {{ "RANK: " + result.rank.toString() }}
                  <br />
                  <br />
                  {{ result.toolKV.value.name }}
                  <br />
                  {{
                    "XXXXX STARS " +
                    result.score.currentValue +
                    "/" +
                    result.score.maxValue
                  }}
                </div>
              </v-col>
              <v-col cols="1">
                <div style="width: 2em;">
                  <!-- Icons -->
                  <v-btn class="ma-2" icon @click="btnEdit()">
                    <v-icon>
                      {{ icons.mdiPencil }}
                    </v-icon>
                  </v-btn>
                </div>
              </v-col>   
              <v-col cols="1">
                <div style="width: 2em;">
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

    <div  style="width: 20em;">
      <v-list dense>
        <ComparisionDataIteratorCardItem
          v-for="(suitability, index) in getSortedCriteria"
          :result="result"
          :propSuitabilityIndex="index"
          :sortBy="sortBy"
          :key="suitability.criteriumKV.key"
        />
    </v-list>
    </div>
  </v-card>
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

import ComparisionDataIteratorCardItem from "./ComparisionDataIteratorCardItem.vue";

export default Vue.extend({
  name: "ComparisionListBox",

  components: {
    ComparisionDataIteratorCardItem,
  },

  props: {
    result: {
      type: Object as () => Typ.toolRating,
    },
    criteria: {
      type: Object as () => Array<Typ.criteriumKeyValue>,
    },
    sortBy: {
      type: String,
    },
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

  //COMPUTED
  computed: {
    //NOTE: Sort DESCending
    getSortedCriteria: function(): Array<Typ.toolCriteriumSuitability> {
      const unsorted: Array<Typ.toolCriteriumSuitability> = this.result.toolKV.value.criteriaSuitabilities;

      const sorted = unsorted.sort((a, b) => {
        if (a.criteriumKV.value.isExclusionCriterium === b.criteriumKV.value.isExclusionCriterium) {
          return b.criteriumKV.value.importance - a.criteriumKV.value.importance
        } else if (a.criteriumKV.value.isExclusionCriterium) {
          return -1;
        } else {
          return 1;
        }
      });

      return sorted;
    },
  }
  
});
</script>
