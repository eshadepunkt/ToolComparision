<template>
  <tr id="CriteriumDataTableRow">
    <td>
      {{ propCriteriumKV.value.name }}
    </td>
    <td>
      {{ propCriteriumKV.value.description }}
    </td>
    <td>
      {{ Typ.convertImportanceEnumToString(propCriteriumKV.value.importance) }}
    </td>
    <td>
      {{ propCriteriumKV.value.isExclusionCriterium }}
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
import CriteriumCreationDialog from "./CriteriumCreationDialog.vue";

export default Vue.extend({
  name: "CriteriumDataTableRow",

  components: {
    CriteriumCreationDialog,
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
  },

  //DATA
  data() {
    return {
      moduleState: Typ.simpleModuleState.minimized as Typ.simpleModuleState,
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
      this.$store.commit("removeCriterium", this.propCriteriumKV);
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
