<template>
  <tr id="CriteriumDataTableRow" v-on:click="btnEdit()">
    <td>
      {{ propCriteriumKV.value.name }}
    </td>
    <td>
      {{ propCriteriumKV.value.description }}
    </td>
    <td>
      {{
        propCriteriumKV.value.isExclusionCriterium
          ? "Exclusion Criterium"
          : Typ.convertImportanceEnumToString(propCriteriumKV.value.importance)
      }}
    </td>
    <td v-if="showConnectedTools">
      {{
        getConnectedToolsNames && getConnectedToolsNames.length > 0
          ? getConnectedToolsNames.length
          : 0
      }}
    </td>
    <td v-if="showConnectedTools">
      {{ getToolsCSV }}
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
              <span> Remove Criterium </span>
            </v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </td>
    <CriteriumCreationDialog
      :showDialog="showDialog"
      :mode="
        !(
          showConnectedTools &&
          getConnectedToolsNames &&
          getConnectedToolsNames.length !== 0
        )
          ? editMode
          : Typ.simpleEditMode.Update
      "
      :propCriteriumKV="propCriteriumKV"
      :workflow="workflow"
      :tools="tools"
      :forceSkipToSuitabilities="forceSkipToSuitabilities"
      v-on:closeDialog="showDialog = false"
    />
    <DeleteConfirmationDialog
      :showDialog="confirmationRequest"
      :deleteItem="propCriteriumKV.value.name"
      :deleteFrom="'Criteria'"
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
} from "@mdi/js";

import Vue from "vue";
import CriteriumCreationDialog from "./CriteriumCreationDialog.vue";
import DeleteConfirmationDialog from "../Other/DeleteConfirmationDialog.vue";

export default Vue.extend({
  name: "CriteriumDataTableRow",

  components: {
    CriteriumCreationDialog,
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
    propCriteriumKV: {
      type: Object as () => Typ.criteriumKeyValue,
    },
    tools: {
      type: Array as () => Array<Typ.toolKeyValue>,
    },
    showConnectedTools: {
      type: Boolean,
      default: false,
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
        mdiStar,
        mdiStarOutline,
        mdiStarHalfFull,
      },
      Typ,
    };
  },

  //METHODS
  methods: {
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
        this.$store.commit("removeCriterium", this.propCriteriumKV);
      }

      this.confirmationRequest = false;
    },
  },

  //COMPUTED
  computed: {
    getConnectedToolsNames: function (): Array<string> {
      let connections: Array<string> = new Array<string>();
      let critKey = this.propCriteriumKV.key;

      this.tools.forEach((element) => {
        if (
          element.value.criteriaSuitabilities.findIndex(
            (x) => x.criteriumKV.key === critKey
          ) !== -1
        ) {
          connections.push(element.value.name);
        }
      });

      return connections;
    },
    getToolsCSV: function (): string {
      let csv = "";

      if (
        this.getConnectedToolsNames &&
        this.getConnectedToolsNames.length > 0
      ) {
        this.getConnectedToolsNames.forEach((name) => {
          csv += name + ", ";
        });

        //Remove last comma
        return csv.slice(0, -2);
      } else {
        return csv;
      }
    },
  },
});
</script>
