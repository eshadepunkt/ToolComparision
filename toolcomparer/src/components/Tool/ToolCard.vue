<template>
  <v-form ref="form" lazy-validation v-model="isValid" id="ToolCard">
    <!-- Fast Debug Settings -->
    <div v-if="debug">
      <v-select
        :items="debugItems"
        label="Module State"
        v-model="selectedDebugItem"
        @change="changeModuleState(selectedDebugItem)"
      >
      </v-select>
    </div>

    <v-card>
      <v-container>
        <!-- Head -->
        <v-row>
          <v-col cols="9">
            <!-- Minimized -->
            <div
              v-if="isMinimized()"
              style="font-size: 1.5em; position: relative; top: 0.5em"
            >
              {{ toolKV.value.name }}
            </div>
            <!-- Maximized -->
            <v-text-field
              v-else
              v-model="toolKV.value.name"
              :rules="rules.str"
              label="Tool name"
              required
              :readonly="!isInCreation()"
            >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-btn
              v-if="!isInCreation()"
              class="ma-2"
              v-bind:style="isMinimized() ? 'transform: scaleY(-1);' : ''"
              icon
              @click="
                [
                  isMinimized()
                    ? changeModuleState('maximized')
                    : changeModuleState('minimized'),
                ]
              "
            >
              <v-icon>
                {{ icons.mdiAppleKeyboardControl }}
              </v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <div
              v-if="!isInCreation()"
              style="font-size: 2em;"
            >
              {{ getRanking() }}
            </div>     
          </v-col>
        </v-row>
        
        <v-row v-if="!isInCreation()">
          <!-- RATING -->
        </v-row>

        <!-- Body -->

        <!-- Description -->
        <v-row v-if="!isMinimized()">
          <v-col cols="9">
            <v-textarea
              outlined
              label="Description"
              v-model="toolKV.value.description"
              :rules="rules.str"
              required
              :readonly="!isInCreation()"
            >
            </v-textarea>
          </v-col>
        </v-row>

        <v-row v-if="!isInCreation()">
          <ToolCriteriumSuitabilityListBox
            :propToolKV="toolKV"
          />
        </v-row>
      </v-container>
    </v-card>
  </v-form>
</template>

<script lang="ts">
console.log("Load ToolCard.vue");
console.dir();

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
  mdiFileRestoreOutline,
} from "@mdi/js";

import Vue from "vue";

import ToolCriteriumSuitabilityListBox from "./ToolCriteriumSuitabilityListBox.vue";

export default Vue.extend({
  name: "ToolCard",

  components: {
    ToolCriteriumSuitabilityListBox,
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
          } as Typ.tool        
        } as Typ.toolKeyValue;
      },
    },
    propModuleState: {
      type: Object as () => Typ.simpleModuleState,
      default: Typ.simpleModuleState.increation as Typ.simpleModuleState,
    },
    propRanking: {
      type: Number,
      default: -1 as number,
    },
    propRating: {
      type: Number,
      default: -1 as number,
    },
  },

  //METHODS
  methods: {
    isMinimized(): boolean {
      return this.moduleState === Typ.simpleModuleState.minimized;
    },
    isInCreation(): boolean {
      return this.moduleState === Typ.simpleModuleState.increation;
    },
    changeModuleState(state: string): void {
      let stateEnum = this.convertStringToModuleStateEnum(state);
      this.moduleState = stateEnum;
    },
    convertStringToModuleStateEnum(convert: string): Typ.simpleModuleState {
      this.selectedDebugItem = convert;

      switch (convert) {
        case "minimized":
          return Typ.simpleModuleState.minimized;
        case "maximized":
          return Typ.simpleModuleState.maximized;
        default:
          return Typ.simpleModuleState.increation;
      }
    },

    getRanking(): string {
      return (this.propRanking !== -1 ? this.propRanking.toString() : "");
    },


    validate(): boolean {
      return (this.$refs.form as Vue & { validate: () => boolean }).validate();
    },
    resetValidation() {
      (this.$refs.form as Vue & { resetValidation: () => void }).resetValidation();
    },
    reset() {
      (this.$refs.form as Vue & { reset: () => void }).reset();
    },

    minAfterValidate() {
      if (this.validate()) {
        this.changeModuleState("minimized");
      }
    },
  },

  //DATA
  data() {
    return {
      toolKV: JSON.parse(JSON.stringify(this.propToolKV)) as Typ.toolKeyValue,
      moduleState: this.propModuleState as Typ.simpleModuleState,

      rules: {
        required: (value: boolean | string) => !!value || "Required",
        str: [
          (val: string) => (val || "").length > 0 || "This field is required",
        ],
      },
      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
        mdiContentSaveEdit,
        mdiFileRestoreOutline,
      },

      isValid: true as boolean,

      debug: false as boolean,
      debugItems: ["minimized", "maximized", "increation"] as string[],
      selectedDebugItem: "" as string,
    };
  },

  //WATCH
  watch: {
    propToolKV: {
      handler(newVal: Typ.toolKeyValue) {
        this.toolKV = newVal;

        //LOG
        console.log("ToolCard: propTool changed!");
      },
      deep: true,
    },
    toolKV: {
      handler(newVal: Typ.toolKeyValue) {
        this.$emit("update_tool", newVal);

        //LOG
        console.log("ToolCard: tool changed!");
      },
      deep: true,
    },
  },

  //MOUNTED
  mounted: function () {
    this.moduleState = this.propModuleState;

    this.resetValidation();

    //LOG
    console.log("ToolCard: Mounted");
  },
});
</script>
