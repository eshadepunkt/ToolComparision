<template>
  <tr id="ComparisionDataTableRow" v-on:click="btnEdit()">
    <td>
      {{ propToolKV.value.name }}
    </td>
    <td>
      {{ propToolKV.value.description }}
    </td>
    <td>
      {{
        propToolKV.value.criteriaSuitabilities &&
        propToolKV.value.criteriaSuitabilities.length > 0
          ? propToolKV.value.criteriaSuitabilities.length
          : 0
      }}
    </td>
    <td width="5em">
      <v-row>
        <v-col cols="5">
          <v-btn class="ma-2" icon @click="btnDelete()">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">
                  {{ icons.mdiDelete }}
                </v-icon>
              </template>
              <span> Remove Tool </span>
            </v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </td>
    <ToolCreationDialog
      :showDialog="showDialog"
      :mode="editMode"
      :workflow="workflow"
      :propToolKV="propToolKV"
      :criteria="criteria"
      :forceSkipToSuitabilities="forceSkipToSuitabilities"
      v-on:closeDialog="showDialog = false"
    />
    <DeleteConfirmationDialog
      :showDialog="confirmationRequest"
      :deleteItem="propToolKV.value.name"
      :deleteFrom="'Tools'"
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
} from "@mdi/js";

import Vue from "vue";
import ToolCreationDialog from "./ToolCreationDialog.vue";
import DeleteConfirmationDialog from "../Other/DeleteConfirmationDialog.vue";

export default Vue.extend({
  name: "ComparisionDataTableRow",

  components: {
    ToolCreationDialog,
    DeleteConfirmationDialog,
  },

  //PROPS
  props: {
    workflow: {
      type: String,
      default: "CriteriaFirst",
    },
    editMode: {
      type: Number as () => Typ.simpleEditMode,
      default: Typ.simpleEditMode.Update as Typ.simpleEditMode,
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
    forceSkipToSuitabilities: {
      type: Boolean,
      default: false,
    },
  },

  //DATA
  data() {
    return {
      moduleState: Typ.simpleModuleState.minimized as Typ.simpleModuleState,
      showDialog: false as boolean,
      confirmationRequest: false as boolean,

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
      this.confirmationRequest = true;
    },
    deleteItem(deleteItem: boolean) {
      if (deleteItem) {
        this.$store.commit("removeTool", this.propToolKV);
      }

      this.confirmationRequest = false;
    },
  },
});
</script>
