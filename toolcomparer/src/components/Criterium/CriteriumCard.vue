<template>
  <v-form ref="form" lazy-validation v-model="isValid" id="CriteriumCard">
    <v-card>
      <v-container>
        <!-- Head -->
        <v-row>
          <v-col cols="11">
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
      let stateEnum = Typ.convertStringToModuleStateEnum(state);
      this.moduleState = stateEnum;
    },

    updateImportance(importance: string): void {
      let importanceEnum: Typ.criteriumImportance =
        Typ.convertStringToImportanceEnum(importance);
      this.criterium.importance = importanceEnum;
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
    };
  },

  //WATCH
  watch: {
    propCriterium: {
      handler(newVal: Typ.criterium) {
        this.criterium = newVal;
        this.selectedImportance = Typ.convertImportanceEnumToString(
          this.criterium.importance
        );
      },
      deep: true,
    },
    criterium: {
      handler(newVal: Typ.criterium) {
        this.$emit("update_criterium", newVal);
        this.selectedImportance = Typ.convertImportanceEnumToString(
          this.criterium.importance
        );
      },
      deep: true,
    },
  },

  //MOUNTED
  mounted: function () {
    this.moduleState = this.propModuleState;
    this.selectedImportance = Typ.convertImportanceEnumToString(
      this.propCriterium.importance
    );

    this.resetValidation();
  },
});
</script>
