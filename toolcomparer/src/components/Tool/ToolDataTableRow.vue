<template>
  <tr id="ComparisionDataTableRow">
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
    <td>
      {{ getSuitabilitiesCSV() }}
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
    <ToolCreationDialog
      :showDialog="showDialog"
      :mode="editMode"
      :workflow="workflow"
      :propToolKV="propToolKV"
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
import ToolCreationDialog from "./ToolCreationDialog.vue";

export default Vue.extend({
  name: "ComparisionDataTableRow",

  components: {
    ToolCreationDialog,
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
      this.$store.commit("removeTool", this.propToolKV);
    },
    getSuitabilitiesCSV(): string {
      let csv = "";

      if (
        this.propToolKV.value.criteriaSuitabilities &&
        this.propToolKV.value.criteriaSuitabilities.length > 0
      ) {
        this.propToolKV.value.criteriaSuitabilities.forEach((element) => {
          csv += element.criteriumKV.value.name + ", ";
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
