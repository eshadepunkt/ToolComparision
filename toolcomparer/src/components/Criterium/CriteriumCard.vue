<template>
  <v-form ref="form" lazy-validation v-model="isValid" id="CriteriumCard">
    <v-card>
      <v-container>
        <!-- Head -->
        <v-row>
          <v-col>
            <!-- Minimized -->
            <div
              v-if="isMinimized()"
              style="font-size: 1.5em; position: relative; top: 0.5em"
            >
              {{ criteriumKV.value.name }}
            </div>
            <!-- Maximized -->
            <v-text-field
              v-else
              v-model="criteriumKV.value.name"
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
              label="Description"
              v-model="criteriumKV.value.description"
              :rules="
                !$store.getters.getSettingsIsDescriptionMandatory || rules.str
              "
              :required="$store.getters.getSettingsIsDescriptionMandatory"
              :readonly="!isInCreation()"
              no-resize
            >
            </v-textarea>
          </v-col>
        </v-row>

        <!-- Importance -->
        <v-row v-if="!isMinimized()">
          <v-col cols="12">
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
          <v-col cols="12">
            <v-checkbox
              label="Exclusion Criterium"
              v-model="criteriumKV.value.isExclusionCriterium"
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
  name: "CriteriumCard",

  //PROPS
  props: {
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
    propModuleState: {
      type: Number as () => Typ.simpleModuleState,
      default: Typ.simpleModuleState.increation as Typ.simpleModuleState,
    },
  },

  //DATA
  data() {
    return {
      criteriumKV: JSON.parse(
        JSON.stringify(this.propCriteriumKV)
      ) as Typ.criteriumKeyValue,
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

    updateImportance(importance: string): void {
      let importanceEnum: Typ.criteriumImportance =
        Typ.convertStringToImportanceEnum(importance);
      this.criteriumKV.value.importance = importanceEnum;
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
        console.log("Validation reseting");
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
    save(): boolean {
      const isValid: boolean = this.validate();
      if (isValid) {
        this.$store.dispatch("updateCriterium", this.criteriumKV);

        this.updateCriteriumKV();
      }

      return isValid;
    },
    getCriteriumKVIfValid(): Typ.criteriumKeyValue | null {
      const isValid: boolean = this.validate();
      let criteriumKV = null;
      if (isValid) {
        criteriumKV = this.criteriumKV;
      }

      return criteriumKV;
    },
    updateCriteriumKV(): void {
      this.criteriumKV = JSON.parse(JSON.stringify(this.propCriteriumKV));
      this.selectedImportance = Typ.convertImportanceEnumToString(
        this.propCriteriumKV.value.importance
      );
      if (
        this.criteriumKV.value.name === "" &&
        this.criteriumKV.value.description === "" &&
        this.criteriumKV.value.importance === Typ.criteriumImportance.undefined
      ) {
        this.criteriumKV.key = uuidv4();
      }

      this.resetValidation();
    },
  },

  //MOUNTED
  mounted: function () {
    this.updateCriteriumKV();
  },

  //WATCH
  watch: {
    propCriteriumKV: {
      handler() {
        this.updateCriteriumKV();
      },
      deep: true,
    },
  },
});
</script>
