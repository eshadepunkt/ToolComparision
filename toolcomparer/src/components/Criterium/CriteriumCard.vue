<template>
  <v-form ref="form" lazy-validation v-model="isValid" id="CriteriumCard">
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
          <v-col cols="10">
            <!-- Minimized -->
            <div
              v-if="isMinimized()"
              style="font-size: 1.5em; position: relative; top: 0.5em"
            >
              {{ criterium.name }}
            </div>
            <!-- Maximized -->
            <v-text-field
              v-else
              v-model="criterium.name"
              :rules="rules.str"
              label="Criterium name"
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
                ]"
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
          <v-col cols="10">
            <v-textarea
              outlined
              label="Description"
              v-model="criterium.description"
              :rules="rules.str"
              required
              :readonly="!isInCreation()"
            >
            </v-textarea>
          </v-col>
        </v-row>

        <!-- Importance -->
        <v-row v-if="!isMinimized()">
          <v-col cols="10">
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

        <!-- Exclusion Criterium -->
        <v-row v-if="!isMinimized()">
          <v-col cols="10">
            <v-checkbox
              label="Exclusion Criterium"
              v-model="criterium.isExclusionCriterium"
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
console.log("Load CriteriumCard.vue");
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
  name: "CriteriumCard",

  //PROPS
  props: {
    propCriterium: {
      type: Object as () => Typ.criterium,
      default() {
        return {
          name: "",
          description: "",
          importance: Typ.criteriumImportance.undefined,
          isExclusionCriterium: false,
        } as Typ.criterium;
      },
    },
    propModuleState: {
      type: Object as () => Typ.simpleModuleState,
      default: Typ.simpleModuleState.increation as Typ.simpleModuleState,
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
      var stateEnum = this.convertStringToModuleStateEnum(state);
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

    updateImportance(importance: string): void {
      var importanceEnum: Typ.criteriumImportance =
        this.convertStringToImportanceEnum(importance);
      this.criterium.importance = importanceEnum;
    },
    convertStringToImportanceEnum(convert: string): Typ.criteriumImportance {
      convert = convert.replaceAll(" ", "");

      switch (convert) {
        case "veryimportant":
          return Typ.criteriumImportance.veryimportant;
        case "important":
          return Typ.criteriumImportance.important;
        case "neutral":
          return Typ.criteriumImportance.neutral;
        default:
          return Typ.criteriumImportance.unimportant;
      }
    },
    convertImportanceEnumToString(convert: Typ.criteriumImportance): string {
      switch (convert) {
        case Typ.criteriumImportance.veryimportant:
          return "very important";
        case Typ.criteriumImportance.important:
          return "important";
        case Typ.criteriumImportance.neutral:
          return "neutral";
        case Typ.criteriumImportance.unimportant:
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
      criterium: JSON.parse(
        JSON.stringify(this.propCriterium)
      ) as Typ.criterium,

      moduleState: this.propModuleState as Typ.simpleModuleState,

      importanceItems: [
        "very important",
        "important",
        "neutral",
        "unimportant",
      ] as string[],
      selectedImportance: "" as string,

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
    propCriterium: {
      handler(newVal: Typ.criterium) {
        this.criterium = newVal;
        this.selectedImportance = this.convertImportanceEnumToString(
          this.criterium.importance
        );

        //LOG
        console.log("CriteriumCard: propCriterium changed!");
      },
      deep: true,
    },
    criterium: {
      handler(newVal: Typ.criterium) {
        this.$emit("update_criterium", newVal);
        this.selectedImportance = this.convertImportanceEnumToString(
          this.criterium.importance
        );

        //LOG
        console.log("CriteriumCard: criterium changed!");
      },
      deep: true,
    },
  },

  //MOUNTED
  mounted: function () {
    this.moduleState = this.propModuleState;
    this.selectedImportance = this.convertImportanceEnumToString(
      this.propCriterium.importance
    );

    this.resetValidation();

    //LOG
    console.log("CriteriumCard: Mounted");
  },
});
</script>
