<template>
  <div id="CriteriumCreation">
    <v-card min-height="100vh" color="grey lighten-5">
      <v-container>
        <!-- Head -->
        <v-row>
          <v-col xl="12">
            <v-card color="indigo darken-4">
              <h1 style="text-align: center; color: white">
                {{ btnText }} Criterium
              </h1>
            </v-card>
          </v-col>
        </v-row>
        <!-- Body -->
        <v-row>
          <v-col xl="12">
            <v-card outlined>
              <CriteriumCard
                ref="criterium_card"
                :propCriterium="criteriumKV.value"
                :propModuleState="moduleState"
                @update_criterium="updateCriterium"
              />
            </v-card>
          </v-col>
        </v-row>
        <!-- Buttons -->
        <v-row>
          <v-col xl="8"> </v-col>
          <v-col xl="1">
            <v-btn @click="btnCancel()" color="red lighten-5"> Cancel </v-btn>
          </v-col>
          <v-col xl="1"> </v-col>
          <v-col xl="1">
            <v-btn @click="btnSave()" color="teal lighten-5">
              {{ btnText }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts">
console.log("Load CriteriumCreation.vue");

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
} from "@mdi/js";

import Vue from "vue";

import CriteriumCard from "./CriteriumCard.vue";

export default Vue.extend({
  name: "CriteriumCreation",

  components: {
    CriteriumCard,
  },

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
  },

  //DATA
  data() {
    return {
      criteriumKV: JSON.parse(
        JSON.stringify(this.propCriteriumKV)
      ) as Typ.criteriumKeyValue,
      moduleState: Typ.simpleModuleState.increation as Typ.simpleModuleState,

      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiAppleKeyboardControl,
        mdiContentSaveEdit,
      },

      btnText: "Add" as string,

      debug: true as boolean,
    };
  },

  //METHODS
  methods: {
    updateCriterium(newVal: Typ.criterium) {
      this.criteriumKV.value = newVal;
    },
    btnCancel() {
      this.resetCriteriumKV();
      this.navigateTo("/Criteria/");
    },
    btnSave() {
      const isValid: boolean = (
        this.$refs.criterium_card as Vue & { validate: () => boolean }
      ).validate();
      if (isValid) {
        this.$store.dispatch("updateCriterium", this.criteriumKV);

        this.resetCriteriumKV();
        this.navigateTo("/Criteria/");
      }
    },
    resetCriteriumKV(): void {
      this.criteriumKV = {
        key: uuidv4() as string,
        value: {
          name: "",
          description: "",
          importance: Typ.criteriumImportance.undefined,
          isExclusionCriterium: false,
        } as Typ.criterium,
      };
    },
    navigateTo(route: string): void {
      this.$router.push(route);
    },
  },

  //WATCH
  watch: {
    propCriterium: {
      handler(newVal: Typ.criteriumKeyValue) {
        this.criteriumKV = newVal;

        //LOG
        console.log("CriteriumCreation: propCriteriumKV changed!");
      },
      deep: true,
    },
  },

  //MOUNTED
  mounted() {
    this.btnText = this.$route.params.mode;

    const uuid: string = this.$route.params.id;

    if (uuid !== "" && uuid !== uuidNIL) {
      const result = this.$store.getters.getCriterium(uuid);
      if (result !== null) {
        this.criteriumKV = JSON.parse(
          JSON.stringify(result)
        ) as Typ.criteriumKeyValue;

        //LOG
        console.log("CriteriumCreation: Loaded criterium with key: " + uuid);
      }
    }

    //LOG
    console.log("CriteriumCreation: Mounted");
  },
});
</script>
