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
              {{ Tool.name }}
            </div>
            <!-- Maximized -->
            <v-text-field
              v-else
              v-model="Tool.name"
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
              @click="[isMinimized() ? changeModuleState('maximized') : changeModuleState('minimized')]"
            >
              <v-icon>
                {{ icons.mdiAppleKeyboardControl }}
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <!-- Body -->

        <!-- Description -->
        <v-row v-if="!isMinimized()">
          <v-col cols="9">
            <v-textarea
              outlined
              label="Description"
              v-model="Tool.description"
              :rules="rules.str"
              required
              :readonly="!isInCreation()"
            >
            </v-textarea>
          </v-col>
        </v-row>

        <!-- Importance -->
        <v-row v-if="!isMinimized()">
          <v-col cols="9">
            <v-select
              :items="importanceItems"
              label="Importance"
              v-model="selectedImportance"
              :rules="rules.str"
              required
              :readonly="!isInCreation()"
              @change="updateImportance(selectedImportance)"
            >
            </v-select>
          </v-col>
        </v-row>

        <!-- Exclusion Tool -->
        <v-row v-if="!isMinimized()">
          <v-col cols="9">
            <v-checkbox
              label="Exclusion Tool"
              v-model="Tool.isExclusionTool"
              :readonly="!isInCreation()"
            >
            </v-checkbox>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-form>
</template>

<script lang="ts">
console.log("Load ToolCard.vue");
console.dir();

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

export default Vue.extend({
  name: "ToolCard",

  //PROPS
  props: {
    propTool: {
      type: Object as () => Typ.Tool,
      default() {
        return {
          name: "",
          description: "",
          importance: Typ.ToolImportance.undefined,
          isExclusionTool: false,
        } as Typ.Tool;
      },
    },
    propModuleState: {
      type: Object as () => Typ.ToolsModuleState,
      default: Typ.ToolsModuleState.increation as Typ.ToolsModuleState,
    },
  },

  //METHODS
  methods: {
    isMinimized(): boolean {
      return this.moduleState === Typ.ToolsModuleState.minimized;
    },
    isInCreation(): boolean {
      return this.moduleState === Typ.ToolsModuleState.increation;
    },
    changeModuleState(state: string): void {
      var stateEnum = this.convertStringToModuleStateEnum(state);
      this.moduleState = stateEnum;
    },
    convertStringToModuleStateEnum(convert: string): Typ.ToolsModuleState {
      this.selectedDebugItem = convert;

      switch (convert) {
        case "minimized":
          return Typ.ToolsModuleState.minimized;
        case "maximized":
          return Typ.ToolsModuleState.maximized;
        default:
          return Typ.ToolsModuleState.increation;
      }
    },

    updateImportance(importance: string): void {
      var importanceEnum: Typ.ToolImportance =
        this.convertStringToImportanceEnum(importance);
      this.Tool.importance = importanceEnum;
    },
    convertStringToImportanceEnum(convert: string): Typ.ToolImportance {
      convert = convert.replaceAll(" ", "");

      switch (convert) {
        case "veryimportant":
          return Typ.ToolImportance.veryimportant;
        case "important":
          return Typ.ToolImportance.important;
        case "neutral":
          return Typ.ToolImportance.neutral;
        default:
          return Typ.ToolImportance.unimportant;
      }
    },
    convertImportanceEnumToString(convert: Typ.ToolImportance): string {
      switch (convert) {
        case Typ.ToolImportance.veryimportant:
          return "very important";
        case Typ.ToolImportance.important:
          return "important";
        case Typ.ToolImportance.neutral:
          return "neutral";
        case Typ.ToolImportance.unimportant:
          return "unimportant";
        default:
          return "";
      }
    },

    validate(): boolean {
      return (this.$refs.form as Vue & { validate: () => boolean }).validate();
    },
    resetValidation() {
      (
        this.$refs.form as Vue & { resetValidation: () => void }
      ).resetValidation();
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
      Tool: JSON.parse(
        JSON.stringify(this.propTool)
      ) as Typ.Tool,
      restoreTool: {} as Typ.Tool,
      moduleState: this.propModuleState as Typ.ToolsModuleState,

      importanceItems: [
        "very important",
        "important",
        "neutral",
        "unimportant",
      ] as string[],
      selectedImportance: (this.propTool.importance ===
      Typ.ToolImportance.undefined
        ? ""
        : this.propTool.importance ===
          Typ.ToolImportance.veryimportant
        ? "very important"
        : Typ.ToolImportance[this.propTool.importance]) as string,

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
    propTool: {
      handler(newVal: Typ.Tool) {
        this.Tool = newVal;
        this.selectedImportance = this.convertImportanceEnumToString(
          this.Tool.importance
        );

        //LOG
        console.log("ToolCard: propTool changed!");
      },
      deep: true,
    },
    Tool: {
      handler(newVal: Typ.Tool) {
        this.$emit("update_Tool", newVal);
        this.selectedImportance = this.convertImportanceEnumToString(
          this.Tool.importance
        );

        //LOG
        console.log("ToolCard: Tool changed!");
      },
      deep: true,
    },
  },

  //MOUNTED
  mounted: function () {
    this.moduleState = this.propModuleState;
    this.selectedImportance = this.convertImportanceEnumToString(
      this.propTool.importance
    );

    this.resetValidation();

    //LOG
    console.log("ToolCard: Mounted");
  },
});
</script>
