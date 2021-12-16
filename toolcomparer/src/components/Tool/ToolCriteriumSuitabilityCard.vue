<template>
  <v-form
    ref="form"
    lazy-validation
    v-model="isValid"
    id="ToolCriteriumSuitabilityCard"
  >
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
              height="6em"
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
              height="6em"
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
      type: Number as () => Typ.simpleModuleState,
      default: Typ.simpleModuleState.increation as Typ.simpleModuleState,
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
      Typ,

      isValid: true as boolean,
    };
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
      let stateEnum = Typ.convertStringToModuleStateEnum(state);
      this.moduleState = stateEnum;
    },

    updateFullfillment(fullfillment: string): void {
      let fullfillmentEnum: Typ.toolCriteriumFullfillment =
        Typ.convertStringToFullfillmentEnum(fullfillment);
      this.toolCriteriumSuitability.fullfillment = fullfillmentEnum;
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
    getSuitabilityIfValid(): Typ.toolCriteriumSuitability | null {
      const isValid: boolean = this.validate();
      let suitability = null;
      if (isValid) {
        suitability = this.toolCriteriumSuitability;
      }

      return suitability;
    },
  },

  //MOUNTED
  mounted: function () {
    this.moduleState = this.propModuleState;
    this.selectedFullfillment = Typ.convertFullfillmentEnumToString(
      this.toolCriteriumSuitability.fullfillment
    );

    this.resetValidation();
  },

  //WATCH
  watch: {
    propToolCriteriumSuitability: function(newVal: Typ.toolCriteriumSuitability) {
      this.toolCriteriumSuitability = newVal;
      this.selectedFullfillment = Typ.convertFullfillmentEnumToString(this.toolCriteriumSuitability.fullfillment);
      this.resetValidation();
    }
  }
});
</script>
