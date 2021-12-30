<template>
  <v-form
    ref="form"
    lazy-validation
    v-model="isValid"
    id="ToolCriteriumSuitabilityCard"
  >
    <v-card>
      <v-container>
        <v-row v-if="isInCreation()">
          <v-col cols="9">
            <div style="font-size: 1.5em; position: relative; top: 0.5em">
              {{ "Tool: " + propToolKV.value.name }}
            </div>
          </v-col>
        </v-row>
        <v-row v-if="isInCreation()">
          <v-col cols="12">
            <v-textarea
              height="5em"
              outlined
              label="Tool description"
              v-model="propToolKV.value.description"
              :rules="rules.str"
              required
              :readonly="true"
              no-resize
            >
            </v-textarea>
          </v-col>
        </v-row>
        <!-- Head -->
        <v-row>
          <v-col cols="9">
            <div style="font-size: 1.5em; position: relative; top: 0.5em">
              {{
                "Criterium: " +
                (workflow === "CriteriaFirst"
                  ? toolCriteriumSuitability.criteriumKV.value.name
                  : propCriteriumKV.value.name)
              }}
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
              height="5em"
              outlined
              label="Criterium description"
              :rules="rules.str"
              required
              :readonly="true"
              no-resize
              :value="
                workflow === 'CriteriaFirst'
                  ? toolCriteriumSuitability.criteriumKV.value.description
                  : propCriteriumKV.value.description
              "
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
              height="5em"
              outlined
              label="Justification"
              v-model="toolCriteriumSuitability.justification"
              :rules="rules.str"
              required
              :readonly="!isInCreation()"
              no-resize
            >
            </v-textarea>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-form>
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
  mdiFileRestoreOutline,
} from "@mdi/js";

import Vue from "vue";

export default Vue.extend({
  name: "ToolCriteriumSuitabilityCard",

  //PROPS
  props: {
    propToolKV: {
      type: Object as () => Typ.toolKeyValue,
      default() {
        return {
          key: uuidv4() as string,
          value: {
            name: "" as string,
            description: "" as string,
            criteriaSuitabilities: Array<Typ.toolCriteriumSuitability>(),
          } as Typ.tool,
        } as Typ.toolKeyValue;
      },
    },
    workflow: {
      type: String,
      default: "CriteriaFirst",
    },
    propToolCriteriumSuitability: {
      type: Object as () => Typ.toolCriteriumSuitability,
      default() {
        return {
          criteriumKV: {
            key: uuidv4() as string,
            value: {
              name: "",
              description: "",
              importance: Typ.criteriumImportance.undefined,
              isExclusionCriterium: false,
            } as Typ.criterium,
          } as Typ.criteriumKeyValue,
          fullfillment: Typ.toolCriteriumFullfillment.undefined,
          justification: "" as string,
        } as Typ.toolCriteriumSuitability;
      },
    },
    propModuleState: {
      type: Number as () => Typ.simpleModuleState,
      default: Typ.simpleModuleState.increation as Typ.simpleModuleState,
    },
    propCriteriumKV: {
      type: Object as () => Typ.criteriumKeyValue,
      default() {
        return {
          key: uuidv4() as string,
          value: {
            name: "",
            description: "",
            importance: Typ.criteriumImportance.undefined,
            isExclusionCriterium: false,
          } as Typ.criterium,
        } as Typ.criteriumKeyValue;
      },
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
    getSuitabilityEvenIncomplete(): Typ.toolCriteriumSuitability {
      return this.toolCriteriumSuitability;
    },
    updateSuitability() {
      this.toolCriteriumSuitability = JSON.parse(
        JSON.stringify(this.propToolCriteriumSuitability)
      );
      this.selectedFullfillment = Typ.convertFullfillmentEnumToString(
        this.toolCriteriumSuitability.fullfillment
      );

      this.resetValidation();
    },
    updateCriteriumKV(): void {
      this.toolCriteriumSuitability.criteriumKV = JSON.parse(
        JSON.stringify(this.propCriteriumKV)
      );

      if (
        this.propToolCriteriumSuitability.criteriumKV.value.name === "" &&
        this.propToolCriteriumSuitability.criteriumKV.value.description ===
          "" &&
        this.propToolCriteriumSuitability.criteriumKV.value.importance ===
          Typ.criteriumImportance.undefined
      ) {
        this.toolCriteriumSuitability.criteriumKV.key = uuidv4();
      }

      this.resetValidation();
    },
  },

  //MOUNTED
  mounted: function () {
    this.updateSuitability();
  },

  //WATCH
  watch: {
    propToolCriteriumSuitability: {
      handler() {
        this.updateSuitability();
      },
      deep: true,
    },
    propCriteriumKV: {
      handler() {
        this.updateCriteriumKV();
      },
      deep: true,
    },
  },
});
</script>
