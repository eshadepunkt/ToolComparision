<template>
  <tr id="CriteriumDataTableRow">
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
    <CriteriumCreationDialog
      :showDialog="showDialog"
      :mode="editMode"
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
import CriteriumCreationDialog from "../Tool/CriteriumCreationDialog.vue";

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
    propCriteriumKV: {
      type: Object as () => Typ.criteriumKeyValue,
    },
    tools: {
      type: Array as () => Array<Typ.toolKeyValue>,
    },
  },

  //DATA
  data() {
    return {
      moduleState: Typ.simpleModuleState.minimized as Typ.simpleModuleState,
      showDialog: false as boolean,

      editMode: Typ.simpleEditMode.Update,

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
});
</script>
