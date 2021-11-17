<template>
  <div id="ToolCreation">
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
                @update_tool="updateTool"
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
              {{ btnText }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts">
console.log("Load toolCreation.vue");

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
  name: "ToolCreation",

  components: {
    ToolCard,
  },

  //PROPS
  props: {
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

      btnText: "Next" as string,
      mode: "Add" as string,

      debug: true as boolean,
    };
  },

  //METHODS
  methods: {
    updateTool(newVal: Typ.toolKeyValue) {
      this.toolKV = newVal;
    },
    btnCancel() {
      if (this.mode === "Add") {
        this.$store.commit("removeTool", this.toolKV);
      }

      this.resetToolKV();
      this.navigateTo("/Tools/");
    },
    btnSave() {
      const isValid: boolean = (
        this.$refs.tool_card as Vue & { validate: () => boolean }
      ).validate();
      if (isValid) {
        this.$store.dispatch("updateTool", this.toolKV);

        const appendix: string =
          this.mode + "/" + this.toolKV.key + "/" + uuidNIL;

        this.resetToolKV();

        this.navigateTo("/ToolCriteriumSuitabilityCreation/" + appendix);
      }
    },
    btnUpdate() {
      const isValid: boolean = (
        this.$refs.tool_card as Vue & { validate: () => boolean }
      ).validate();
      if (isValid) {
        this.$store.dispatch("updateTool", this.toolKV);

        this.resetToolKV();
        this.navigateTo("/Tools/");
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
    navigateTo(route: string): void {
      this.$router.push(route);
    },
  },

  //WATCH
  watch: {
    propTool: {
      handler(newVal: Typ.toolKeyValue) {
        this.toolKV = newVal;

        //LOG
        console.log("ToolCreation: propToolKV changed!");
      },
      deep: true,
    },
  },

  //MOUNTED
  mounted() {
    this.mode = this.$route.params.mode;
    const tooluuid: string = this.$route.params.toolid;

    if (tooluuid !== "" && tooluuid !== uuidNIL) {
      const result = this.$store.getters.getTool(tooluuid);
      if (result !== null) {
        this.toolKV = JSON.parse(JSON.stringify(result)) as Typ.toolKeyValue;

        //LOG
        console.log("ToolCreation: Loaded tool with key: " + tooluuid);

        return;
      }
    }

    //LOG
    console.log("ToolCreation: Mounted");
  },
});
</script>
