<template>

<div id="CriteriumCreation">
    <v-card
        min-height="100vh"
        color="grey lighten-5">
        <v-container>
            <!-- Head -->
            <v-row>
                <v-col xl="6">
                    <v-card
                        color="indigo darken-4">
                        <h1 style="text-align: center; color: white">
                            {{ btnText }} Criterium
                        </h1>
                    </v-card>
                </v-col>           
            </v-row>
            <!-- Body -->
            <v-row>
                <v-col xl="6">
                    <v-card
                        outlined    
                    >
                        <CriteriumCard ref="criterium_card"
                        :propCriterium="criteriumKV.value"
                        :propModuleState="moduleState"
                        :propEditState="editState"
                        @update_criterium="updateCriterium"
                    />                   
                    </v-card>                      
            </v-col>
        </v-row>
        <!-- Buttons -->
        <v-row>
            <v-col cols="8">
            </v-col>
            <v-col cols="1">
                <v-btn @click="btnCancel()"
                    color="red lighten-5"
                >
                    Cancel
                </v-btn>
            </v-col>
            <v-col cols="1">
            </v-col>
            <v-col cols="1">
                <v-btn @click="btnSave()"
                    color="teal lighten-5"
                >
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

import * as Typ from "../types/index";
import {
    mdiAccount,
    mdiPencil,
    mdiShareVariant,
    mdiDelete,
    mdiAppleKeyboardControl,
  } from '@mdi/js';

import Vue from 'vue';


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
            default: { 
                key: -1 as number,
                value: {
                    name: "",
                    description: "",
                    importance: Typ.criteriumImportance.undefined,
                    isExclusionCriterium: false
                } as Typ.criterium 
            } as Typ.criteriumKeyValue
        },
        btnText: {
            type: String,
            default: "Add",
        },
    },

    //DATA
    data() {
        return {
            criteriumKV: JSON.parse(JSON.stringify(this.propCriteriumKV)) as Typ.criteriumKeyValue,
            moduleState: Typ.criteriaModuleState.increation as Typ.criteriaModuleState,      
            editState: Typ.editCriteriaModule.increation as Typ.editCriteriaModule,

            icons: {
                mdiAccount,
                mdiPencil,
                mdiShareVariant,
                mdiDelete,
                mdiAppleKeyboardControl,
            },

            debug: true as boolean,
        }        
    },

    //METHODS
    methods: {
        updateCriterium(newVal: Typ.criterium) {
            this.criteriumKV.value = newVal;

            //LOG
            console.log("CriteriumCreation: criterium updated!");
        },
        btnCancel()
        {    
            //LOG
            console.log("CriteriumCreation: CANCEL button clicked");

            this.resetCriteriumKV();
            this.emitAppStateChange("criteria");
        },
        btnSave()
        {
            if((this.$refs.criterium_card as Vue & { validate: () => boolean }).validate())
            {               
                if (this.criteriumKV.key === -1) {
                    this.$store.commit("incrementUniqueID");
                    this.criteriumKV.key = this.$store.getters.getID;

                    //LOG
                    console.log("CriteriumCreation: unique key: " + this.criteriumKV.key + " generated");
                }

                this.$store.dispatch("updateCriterium", this.criteriumKV);

                //LOG
                console.log("CriteriumCreation: store updated");

                this.resetCriteriumKV();
                this.emitAppStateChange("criteria");
            }
        },
        resetCriteriumKV() : void {
            this.criteriumKV = { 
                key: -1 as number,
                value: {
                    name: "",
                    description: "",
                    importance: Typ.criteriumImportance.undefined,
                    isExclusionCriterium: false
                } as Typ.criterium 
            }
        },
        emitAppStateChange(state: string) : void {
            this.$emit("change_app_state", state);
        },
    },

    //WATCH
    watch: {
        propCriterium:  {
            handler(newVal: Typ.criteriumKeyValue) {
                this.criteriumKV = newVal;

                //LOG
                console.log("CriteriumCreation: propCriteriumKV changed!");
            },
            deep: true,        
        },
    },
});
</script>