<template>
  <div id="ToolCreation">
    <v-card min-height="100vh" color="grey lighten-5">
      <v-container>
        <!-- Head -->
        <v-row>
          <v-col xl="11">
            <v-card color="indigo darken-4">
              <h1 style="text-align: center; color: white">
                {{ btnText }} Tool
              </h1>
            </v-card>
          </v-col>
        </v-row>
        <!-- Body -->
        <v-row>
          <v-col xl="11">
            <v-card outlined>
              <ToolCard
                ref="Tool_card"
                :propTool="ToolKV.value"
                :propModuleState="moduleState"
                @update_Tool="updateTool"
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
          <v-col xl="1"> </v-col>
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
console.log("Load ToolCreation.vue");

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
      type: Object as () => Typ.ToolKeyValue,
      default() {
        return {
          key: uuidv4() as string,
          value: {
            name: "",
            description: "",
            importance: Typ.ToolImportance.undefined,
            isExclusionTool: false,
          } as Typ.Tool,
        } as Typ.ToolKeyValue;
      },
    },
  },

  //DATA
  data() {
    return {
      ToolKV: JSON.parse(
        JSON.stringify(this.propToolKV)
      ) as Typ.ToolKeyValue,
      moduleState: Typ.ToolsModuleState
        .increation as Typ.ToolsModuleState,

      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
        mdiContentSaveEdit,
      },

      btnText: "Add" as string,

      debug: true as boolean,
    };
  },

  //METHODS
  methods: {
    updateTool(newVal: Typ.Tool) {
      this.ToolKV.value = newVal;
    },
    btnCancel() {
      this.resetToolKV();
      this.navigateTo("/Tools/");
    },
    btnSave() {
      if (
        (
          this.$refs.Tool_card as Vue & { validate: () => boolean }
        ).validate()
      ) {
        this.$store.dispatch("updateTool", this.ToolKV);

        this.resetToolKV();
        this.navigateTo("/Tools/");
      }
    },
    resetToolKV(): void {
      this.ToolKV = {
        key: uuidv4() as string,
        value: {
          name: "",
          description: "",
          importance: Typ.ToolImportance.undefined,
          isExclusionTool: false,
        } as Typ.Tool,
      };
    },
    navigateTo(route: string): void {
      this.$router.push(route);
    },
  },

  //WATCH
  watch: {
    propTool: {
      handler(newVal: Typ.ToolKeyValue) {
        this.ToolKV = newVal;

        //LOG
        console.log("ToolCreation: propToolKV changed!");
      },
      deep: true,
    },
  },

  //MOUNTED
  mounted() {
    this.btnText = this.$route.params.mode;

    const uuid: string = this.$route.params.id;

    if (uuid !== uuidNIL) {
      const result = this.$store.getters.getTool(uuid);
      if (result !== null) {
        this.ToolKV = JSON.parse(
          JSON.stringify(result)
        ) as Typ.ToolKeyValue;

        //LOG
        console.log("ToolCreation: Loaded Tool with key: " + uuid);

        console.log(
          "\nImportance:\n" +
            Typ.ToolImportance[this.ToolKV.value.importance] +
            "\n"
        );
      }
    }

    //LOG
    console.log("ToolCreation: Mounted");
  },
});
</script>
