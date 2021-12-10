<template>
  <div id="ToolLastCreation">
    <v-card min-height="100vh" color="grey lighten-5">
      <v-container>
        <!-- Head -->
        <v-row>
          <v-col xl="12">
            <v-card color="indigo darken-4">
              <h1 style="text-align: center; color: white">{{ mode }} tool</h1>
            </v-card>
          </v-col>
        </v-row>
        <!-- Body -->
        <v-row>
          <v-col xl="12">
            <v-card outlined>
              <ToolCard
                ref="tool_card"
                :propToolKV="toolKV"
                :propModuleState="moduleState"
              />
            </v-card>
          </v-col>
        </v-row>
        <!-- Buttons -->
        <v-row>
          <v-col xl="8"> </v-col>
          <v-col xl="1">
            <v-btn @click="btnCancel()" color="red lighten-5"> Cancel </v-btn>
          </v-col>
          <v-col xl="1">
            <v-btn
              v-if="mode === 'Update'"
              @click="btnUpdate()"
              color="blue lighten-5"
            >
              Update-Save-Return
            </v-btn>
          </v-col>
          <v-col xl="1">
            <v-btn @click="btnSave()" color="teal lighten-5">
              {{ tbtnText }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
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
  mdiContentSaveEdit,
} from "@mdi/js";

import Vue from "vue";

import ToolCard from "./ToolCard.vue";

export default Vue.extend({
  name: "ToolLastCreation",

  components: {
    ToolCard,
  },

  //PROPS
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    btnText: {
      type: String,
      default: "Next",
    },
    mode: {
      type: String,
      default: "Add",
    },
    propToolKV: {
      type: Object as () => Typ.toolKeyValue,
      default() {
        return {
          key: uuidv4() as string,
          value: {
            name: "",
            description: "",
            criteriaSuitabilities: Array<Typ.toolCriteriumSuitability>(),
          } as Typ.tool,
        } as Typ.toolKeyValue;
      },
    },
  },

  //DATA
  data() {
    return {
      toolKV: JSON.parse(JSON.stringify(this.propToolKV)) as Typ.toolKeyValue,
      moduleState: Typ.simpleModuleState.increation as Typ.simpleModuleState,

      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
        mdiContentSaveEdit,
      },

      tbtnText: this.btnText as string,
    };
  },

  //METHODS
  methods: {
    btnCancel() {
      if (this.mode === "Add") {
        this.$store.commit("removeTool", this.toolKV);
      }

      this.resetToolKV();
      this.closeDialog();
    },
    btnSave() {
      const isValid: boolean = (
        this.$refs.tool_card as Vue & { validate: () => boolean }
      ).validate();
      if (isValid) {
        this.$store.dispatch("updateTool", this.toolKV);

        this.resetToolKV();
        this.closeDialog();
      }
    },
    btnUpdate() {
      const isValid: boolean = (
        this.$refs.tool_card as Vue & { validate: () => boolean }
      ).validate();
      if (isValid) {
        this.$store.dispatch("updateTool", this.toolKV);

        this.resetToolKV();
        this.closeDialog();
      }
    },

    resetToolKV(): void {
      this.toolKV = {
        key: uuidv4() as string,
        value: {
          name: "",
          description: "",
          criteriaSuitabilities: Array<Typ.toolCriteriumSuitability>(),
        } as Typ.tool,
      };
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
});
</script>
