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
              {{ "Tool: " + toolKVSuitabilityItem.toolKV.value.name }}
            </div>
          </v-col>
        </v-row>
        <v-row v-if="isInCreation()">
          <v-col cols="12">
            <v-textarea
              height="5em"
              outlined
              label="Tool description"
              v-model="toolKVSuitabilityItem.toolKV.value.description"
              :rules="rules.str"
              :required="$store.getters.getSettingsIsDescriptionMandatory"
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
                toolKVSuitabilityItem.suitability.criteriumKV.value.name
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
              :required="$store.getters.getSettingsIsDescriptionMandatory"
              :readonly="true"
              no-resize
              :value="
                toolKVSuitabilityItem.suitability.criteriumKV.value.description
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
              v-model="toolKVSuitabilityItem.suitability.justification"
              :rules="rules.str"
              :required="$store.getters.getSettingsIsJustificationMandatory"
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
    workflow: {
      type: String,
      default: "CriteriaFirst",
    },
    propToolKVSuitabilityItem: {
      type: Object as () => Typ.toolKVSuitabilityItem,
      default() {
        return {
          toolKV: {
            key: uuidv4() as string,
            value: {
              name: "",
              description: "",
              criteriaSuitabilities: Array<Typ.toolCriteriumSuitability>(),
            } as Typ.tool,
          } as Typ.toolKeyValue,
          suitability: {
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
          } as Typ.toolCriteriumSuitability,
        } as Typ.toolKVSuitabilityItem;
      },
    },
    propModuleState: {
      type: Number as () => Typ.simpleModuleState,
      default: Typ.simpleModuleState.increation as Typ.simpleModuleState,
    },
  },

  //DATA
  data() {
    return {
      toolKVSuitabilityItem: JSON.parse(
        JSON.stringify(this.propToolKVSuitabilityItem)
      ) as Typ.toolKVSuitabilityItem,

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
      this.toolKVSuitabilityItem.suitability.fullfillment = fullfillmentEnum;
    },
    validate(): boolean {
      return (this.$refs.form as Vue & { validate: () => boolean }).validate();
    },
    resetValidation() {
      try {
        (
          this.$refs.form as Vue & { resetValidation: () => void }
        ).resetValidation();
      } catch {
        console.log("Validation reseted");
      }
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
          this.toolKVSuitabilityItem.suitability.criteriumKV.value.importance,
          2
        ) * Typ.toolCriteriumFullfillment.verygood;

      const min: number =
        Math.pow(
          this.toolKVSuitabilityItem.suitability.criteriumKV.value.importance,
          2
        ) * this.toolKVSuitabilityItem.suitability.fullfillment;

      return min + "/" + max;
    },
    getSuitabilityIfValid(): Typ.toolKVSuitabilityItem | null {
      const isValid: boolean = this.validate();
      let suitability = null;
      if (isValid) {
        suitability = this.toolKVSuitabilityItem;
      }

      return suitability;
    },
    getSuitabilityEvenIncomplete(): Typ.toolKVSuitabilityItem {
      return this.toolKVSuitabilityItem;
    },
    updateSuitability() {
      this.toolKVSuitabilityItem = JSON.parse(
        JSON.stringify(this.propToolKVSuitabilityItem)
      );
      this.selectedFullfillment = Typ.convertFullfillmentEnumToString(
        this.toolKVSuitabilityItem.suitability.fullfillment
      );

      this.resetValidation();
    },
    updateCriteriumKV(): void {
      this.toolKVSuitabilityItem.suitability.criteriumKV = JSON.parse(
        JSON.stringify(this.propToolKVSuitabilityItem)
      );

      if (
        this.propToolKVSuitabilityItem.suitability.criteriumKV.value.name ===
          "" &&
        this.propToolKVSuitabilityItem.suitability.criteriumKV.value
          .description === "" &&
        this.propToolKVSuitabilityItem.suitability.criteriumKV.value
          .importance === Typ.criteriumImportance.undefined
      ) {
        this.toolKVSuitabilityItem.suitability.criteriumKV.key = uuidv4();
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
    propToolKVSuitabilityItem: {
      handler() {
        this.updateSuitability();
      },
      deep: true,
    },
  },
});
</script>
