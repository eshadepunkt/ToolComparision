<template>
  <v-form ref="form" lazy-validation v-model="isValid" id="ToolCard">
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
          <v-col cols="1">
            <div v-if="!isInCreation()" style="font-size: 2em">
              {{ getRanking() }}
            </div>
          </v-col>
        </v-row>

        <v-row v-if="!isInCreation()">
          <!-- RATING -->
          <v-col cols="12">
            <div id="rating_div">
              {{ getRating() }}
            </div>
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
              v-model="toolKV.value.description"
              :rules="
                !$store.getters.getSettingsIsDescriptionMandatory || rules.str
              "
              :required="$store.getters.getSettingsIsDescriprionMandatory"
              :readonly="!isInCreation()"
              no-resize
            >
            </v-textarea>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <ToolCriteriumSuitabilityListBox
              v-if="
                !isInCreation() &&
                !isMinimized() &&
                this.propToolKV.value.criteriaSuitabilities &&
                this.propToolKV.value.criteriaSuitabilities.length > 0
              "
              :propToolKV="toolKV"
            />
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
          } as Typ.tool,
        } as Typ.toolKeyValue;
      },
    },
    propModuleState: {
      type: Number as () => Typ.simpleModuleState,
      default: Typ.simpleModuleState.increation as Typ.simpleModuleState,
    },

    propToolRating: {
      type: Object as () => Typ.toolRating,
      default: undefined,
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

    getRanking(): string {
      return this.propToolRating !== undefined
        ? this.propToolRating.rank.toString()
        : "rX";
    },
    getRating(): string {
      if (this.propToolRating !== undefined) {
        return (
          "XXXXX STARS     " +
          this.propToolRating.score.currentValue +
          "/" +
          this.propToolRating.score.maxValue
        );
      }

      return "XXXXX STARS      YY/ZZ";
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
        this.$store.dispatch("updateTool", this.toolKV);
        this.resetToolKV();
      }

      return isValid;
    },
    getToolKVIfValid(): Typ.toolKeyValue | null {
      const isValid: boolean = this.validate();
      let toolKV = null;
      if (isValid) {
        toolKV = this.toolKV;
      }

      return toolKV;
    },
    resetToolKV() {
      this.toolKV = JSON.parse(JSON.stringify(this.propToolKV));
      if (
        this.toolKV.value.name === "" &&
        this.toolKV.value.description === ""
      ) {
        this.toolKV.key = uuidv4();
      }

      this.resetValidation();
    },
  },

  //MOUNTED
  mounted: function () {
    this.resetToolKV();
  },

  //WATCH
  watch: {
    propToolKV: {
      handler() {
        this.resetToolKV();
      },
      deep: true,
    },
  },
});
</script>
