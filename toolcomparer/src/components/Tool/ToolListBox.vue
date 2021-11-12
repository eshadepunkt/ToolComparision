<template>
  <div id="ToolListBox">
    <v-card min-height="100vh" color="grey lighten-5">
      <v-container>
        <!-- Head -->
        <v-row>
          <v-col xl="11">
            <v-card color="indigo darken-4">
              <h1 style="text-align: center; color: white">Tools</h1>
            </v-card>
          </v-col>
        </v-row>

        <!-- Body -->
        <v-row>
          <v-col xl="11">
            <v-list style="height: 72vh; overflow-y: auto">
              <v-item-group>
                <v-item v-for="item in getTools()" :key="item.key">
                  <ToolListItem :propToolKV="item" />
                </v-item>
              </v-item-group>
            </v-list>
          </v-col>
        </v-row>

        <!-- Buttons -->
        <v-row
          align="center"
          align-content="space-between"
          justify="space-between"
        >
          <v-col xl="1">
            <v-btn @click="navigateTo('/Criteria/')" color="red lighten-5">
              Change Criteria
            </v-btn>
          </v-col>
          <v-col xl="1">
            <v-btn
              @click="navigateTo('/ToolCreation/Add/' + uuidNIL)"
              color="teal lighten-5"
            >
              Add tool
            </v-btn>
          </v-col>
          <v-col xl="1">
            <v-btn @click="navigateTo('/Tools/')" color="blue lighten-5">
              Comparision
            </v-btn>
          </v-col>
        </v-row>
        <v-row
          align="center"
          align-content="space-between"
          justify="space-between"
        >
          <v-col xl="1">
            <v-btn @click="importTools()"> Import </v-btn>
            <input
              ref="uploader"
              class="d-none"
              type="file"
              accept=".json"
              @change="onFileChanged"
            />
          </v-col>
          <v-col xl="1">
            <v-btn @click="exportTools()"> Export </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts">
console.log("Load ToolListBox.vue");

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

import ToolListItem from "./ToolListItem.vue";

export default Vue.extend({
  name: "ToolListBox",

  components: {
    ToolListItem,
  },

  //DATA
  data() {
    return {
      tools: {} as Array<Typ.toolKeyValue>,
      uuidNIL,
    };
  },

  //METHODS
  methods: {
    navigateTo(route: string): void {
      this.$router.push(route);
    },
    getTools(): Array<Typ.toolKeyValue> {
      this.tools = this.$store.getters.getTools;

      return this.tools;
    },
    exportTools() {
      const json: string = JSON.stringify(this.tools);
      const filename = "toolcomparer_tools.json";

      let element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(json)
      );
      element.setAttribute("download", filename);

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    importTools() {
      (this.$refs.uploader as Vue & { click: () => void }).click();
    },
    onFileChanged(e: any) {
      const file = e.target.files[0];
      let reader = new FileReader();
      let json: string | undefined;
      reader.onload = function () {
        json = reader.result?.toString();

        //LOG
        console.log(json);

        e.target.value = null;
      };
      reader.onloadend = () => this.convertJSONToArray(json);
      reader.readAsText(file);
    },
    convertJSONToArray(json: string | undefined) {
      if (json !== undefined) {
        const tmpTools: Array<Typ.toolKeyValue> = JSON.parse(
          json
        ) as Array<Typ.toolKeyValue>;
        this.$store.dispatch("extendTools", tmpTools);
      }
    },
  },

  //MOUNTED
  mounted: function () {
    this.tools = this.$store.getters.getTools;

    //LOG
    console.log("ToolCreation: Mounted");
  },
});
</script>
