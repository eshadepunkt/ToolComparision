<template>
  <tr id="ComparisionDataTableRow">
    <td>
      {{ propCriteriumKV.value.name }}
    </td>
    <td>
      {{ propCriteriumKV.value.description }}
    </td>
    <td>
      {{ Typ.convertImportanceEnumToString(propCriteriumKV.value.name) }}
    </td>
    <td>
      {{ propCriteriumKV.value.isExclusionCriterium }}
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
import ToolCreationDialog from "../Tool/ToolCreationDialog.vue";

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
