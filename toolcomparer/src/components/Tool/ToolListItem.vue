<template>
  <div id="ToolListItem">
    <v-card>
      <v-container>
        <v-row>
          <v-col cols="10">
            <ToolCard
              :propToolKV="
                propToolRating === undefined ? propToolKV : propToolRating.tool
              "
              :propModuleState="moduleState"
              :propToolRating="propToolRating"
            />
          </v-col>
          <!-- Icons -->
          <v-col cols="1">
            <v-btn class="ma-2" icon @click="btnEdit()">
              <v-icon>
                {{ icons.mdiPencil }}
              </v-icon>
            </v-btn>
          </v-col>
          <v-col cols="1">
            <v-btn class="ma-2" icon @click="btnDelete()">
              <v-icon>
                {{ icons.mdiDelete }}
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <ToolCreationDialog
      :showDialog="showDialog"
      :mode="editMode"
      :workflow="workflow"
      :propToolKV="propToolKV"
      :criteria="criteria"
      v-on:closeDialog="showDialog = false"
    />
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

import ToolCard from "./ToolCard.vue";
import ToolCreationDialog from "./ToolCreationDialog.vue";

export default Vue.extend({
  name: "ToolListItem",

  components: {
    ToolCard,
    ToolCreationDialog,
  },

  //PROPS
  props: {
    workflow: {
      type: String,
      default: "CriteriaFirst",
    },
    propToolKV: {
      type: Object as () => Typ.toolKeyValue,
    },

    propToolRating: {
      type: Object as () => Typ.toolRating,
      default: undefined,
    },
    criteria: {
      type: Array as () => Array<Typ.criteriumKeyValue>,
    },
  },

  //DATA
  data() {
    return {
      moduleState: Typ.simpleModuleState.minimized as Typ.simpleModuleState,
      editMode: Typ.simpleEditMode.Update,
      showDialog: false as boolean,

      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
      },
      Typ,
    };
  },

  //METHODS
  methods: {
    btnEdit() {
      this.showDialog = true;
    },
    btnDelete() {
      this.$store.commit("removeTool", this.propToolKV);
    },
  },
});
</script>
