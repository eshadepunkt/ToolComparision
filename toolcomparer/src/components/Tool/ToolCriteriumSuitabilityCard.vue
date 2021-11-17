<template>
  <v-form
    ref="form"
    lazy-validation
    v-model="isValid"
    id="ToolCriteriumSuitabilityCard"
  >
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
            <div style="font-size: 1.5em; position: relative; top: 0.5em">
              {{ toolCriteriumSuitability.criteriumKV.value.name }}
            </div>
          </v-col>
          <v-col cols="2">
            <div v-if="!isInCreation()">
              {{ getResultString() }}
            </div>
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
          <v-col cols="12">
            <v-textarea
              outlined
              label="Criterium description"
              v-model="toolCriteriumSuitability.criteriumKV.value.description"
              :rules="rules.str"
              required
              :readonly="true"
            >
            </v-textarea>
          </v-col>
        </v-row>

        <!-- Fullfilment -->
        <v-row v-if="!isMinimized()">
          <v-col cols="12">
            <v-select
              :items="fullfillmentItems"
              label="Fullfillment"
              v-model="selectedFullfillment"
              :rules="rules.str"
              required
              :readonly="!isInCreation()"
              @change="updateFullfillment(selectedFullfillment)"
            >
            </v-select>
          </v-col>
        </v-row>

        <!-- Justification -->
        <v-row v-if="!isMinimized()">
          <v-col cols="12">
            <v-textarea
              outlined
              label="Justification"
              v-model="toolCriteriumSuitability.justification"
              :rules="rules.str"
              required
              :readonly="!isInCreation()"
            >
            </v-textarea>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-form>
</template>

<script lang="ts">
console.log("Load ToolCriteriumSuitabilityCard.vue");
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
  name: "ToolCriteriumSuitabilityCard",

  //PROPS
  props: {
    propToolCriteriumSuitability: {
      type: Object as () => Typ.toolCriteriumSuitability,
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

    updateFullfillment(fullfillment: string): void {
      let fullfillmentEnum: Typ.toolCriteriumFullfillment =
        this.convertStringToFullfillmentEnum(fullfillment);
      this.toolCriteriumSuitability.fullfillment = fullfillmentEnum;
    },

    convertStringToFullfillmentEnum(
      convert: string
    ): Typ.toolCriteriumFullfillment {
      convert = convert.replaceAll(" ", "");

      switch (convert) {
        case "verygood":
          return Typ.toolCriteriumFullfillment.verygood;
        case "good":
          return Typ.toolCriteriumFullfillment.good;
        case "normal":
          return Typ.toolCriteriumFullfillment.normal;
        case "bad":
          return Typ.toolCriteriumFullfillment.bad;
        case "verybad":
          return Typ.toolCriteriumFullfillment.verybad;
        default:
          return Typ.toolCriteriumFullfillment.doesnot;
      }
    },

    convertFullfillmentEnumToString(
      convert: Typ.toolCriteriumFullfillment
    ): string {
      switch (convert) {
        case Typ.toolCriteriumFullfillment.verygood:
          return "very good";
        case Typ.toolCriteriumFullfillment.good:
          return "good";
        case Typ.toolCriteriumFullfillment.normal:
          return "normal";
        case Typ.toolCriteriumFullfillment.bad:
          return "bad";
        case Typ.toolCriteriumFullfillment.verybad:
          return "very bad";
        case Typ.toolCriteriumFullfillment.doesnot:
          return "does not";
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

    getResultString(): string {
      const max: number =
        Math.pow(
          this.toolCriteriumSuitability.criteriumKV.value.importance,
          2
        ) * Typ.toolCriteriumFullfillment.verygood;

      const min: number =
        Math.pow(
          this.toolCriteriumSuitability.criteriumKV.value.importance,
          2
        ) * this.toolCriteriumSuitability.fullfillment;

      return min + "/" + max;
    },
  },

  //DATA
  data() {
    return {
      toolCriteriumSuitability: JSON.parse(
        JSON.stringify(this.propToolCriteriumSuitability)
      ) as Typ.toolCriteriumSuitability,

      moduleState: this.propModuleState as Typ.simpleModuleState,

      fullfillmentItems: [
        "very good",
        "good",
        "normal",
        "bad",
        "very bad",
        "does not",
      ] as string[],

      selectedFullfillment: "" as string,

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
    propToolCriteriumSuitability: {
      handler(newVal: Typ.toolCriteriumSuitability) {
        this.toolCriteriumSuitability = newVal;
        this.selectedFullfillment = this.convertFullfillmentEnumToString(
          this.toolCriteriumSuitability.fullfillment
        );

        //LOG
        console.log(
          "ToolCriteriumSuitabilityCard: propToolCriteriumSuitability changed!"
        );
      },
      deep: true,
    },
    toolCriteriumSuitability: {
      handler(newVal: Typ.toolCriteriumSuitability) {
        this.$emit("update_tool_suitability", newVal);
        this.selectedFullfillment = this.convertFullfillmentEnumToString(
          this.toolCriteriumSuitability.fullfillment
        );

        //LOG
        console.log(
          "ToolCriteriumSuitabilityCard: toolCriteriumSuitability changed!"
        );
      },
      deep: true,
    },
  },

  //MOUNTED
  mounted: function () {
    this.moduleState = this.propModuleState;
    this.selectedFullfillment = this.convertFullfillmentEnumToString(
      this.toolCriteriumSuitability.fullfillment
    );

    this.resetValidation();

    //LOG
    console.log("ToolCriteriumSuitabilityCard: Mounted");
  },
});
</script>
