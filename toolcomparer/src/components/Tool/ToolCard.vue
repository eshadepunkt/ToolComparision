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
              {{ tool.name }}
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

        <!-- Exclusion tool -->
        <v-row v-if="!isMinimized()">
          <v-col cols="9">
            <v-checkbox
              label="Exclusion tool"
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
      type: Object as () => Typ.tool,
      default() {
        return {
          name: "",
          description: "",
          criteriaSuitabilities: Array<Typ.toolCriteriumSuitability>(),
        } as Typ.tool;
      },
    },
    propModuleState: {
      type: Object as () => Typ.toolsModuleState,
      default: Typ.toolsModuleState.increation as Typ.toolsModuleState,
    },
  },

  //METHODS
  methods: {
    isMinimized(): boolean {
      return this.moduleState === Typ.toolsModuleState.minimized;
    },
    isInCreation(): boolean {
      return this.moduleState === Typ.toolsModuleState.increation;
    },
    changeModuleState(state: string): void {
      var stateEnum = this.convertStringToModuleStateEnum(state);
      this.moduleState = stateEnum;
    },
    convertStringToModuleStateEnum(convert: string): Typ.toolsModuleState {
      this.selectedDebugItem = convert;

      switch (convert) {
        case "minimized":
          return Typ.toolsModuleState.minimized;
        case "maximized":
          return Typ.toolsModuleState.maximized;
        default:
          return Typ.toolsModuleState.increation;
      }
    },

    updateImportance(importance: string): void {
      var importanceEnum: Typ.toolImportance =
        this.convertStringToImportanceEnum(importance);
      this.tool.importance = importanceEnum;
    },
    convertStringToImportanceEnum(convert: string): Typ.toolImportance {
      convert = convert.replaceAll(" ", "");

      switch (convert) {
        case "veryimportant":
          return Typ.toolImportance.veryimportant;
        case "important":
          return Typ.toolImportance.important;
        case "neutral":
          return Typ.toolImportance.neutral;
        default:
          return Typ.toolImportance.unimportant;
      }
    },
    convertImportanceEnumToString(convert: Typ.toolImportance): string {
      switch (convert) {
        case Typ.toolImportance.veryimportant:
          return "very important";
        case Typ.toolImportance.important:
          return "important";
        case Typ.toolImportance.neutral:
          return "neutral";
        case Typ.toolImportance.unimportant:
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
      tool: JSON.parse(JSON.stringify(this.propTool)) as Typ.tool,
      restoreTool: {} as Typ.tool,
      moduleState: this.propModuleState as Typ.toolsModuleState,

      importanceItems: [
        "very important",
        "important",
        "neutral",
        "unimportant",
      ] as string[],
      selectedImportance: (this.propTool.importance ===
      Typ.toolImportance.undefined
        ? ""
        : this.propTool.importance === Typ.toolImportance.veryimportant
        ? "very important"
        : Typ.toolImportance[this.propTool.importance]) as string,

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
      handler(newVal: Typ.tool) {
        this.tool = newVal;
        this.selectedImportance = this.convertImportanceEnumToString(
          this.tool.importance
        );

        //LOG
        console.log("ToolCard: propTool changed!");
      },
      deep: true,
    },
    tool: {
      handler(newVal: Typ.tool) {
        this.$emit("update_Tool", newVal);
        this.selectedImportance = this.convertImportanceEnumToString(
          this.tool.importance
        );

        //LOG
        console.log("ToolCard: tool changed!");
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
