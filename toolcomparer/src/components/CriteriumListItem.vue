<template>

<div id="CriteriumListItem">
    <v-card>
        <v-container>
            <v-row>
                <v-col cols="9">
                <CriteriumCard 
                    :propCriterium="criteriumKV.value"
                    :propModuleState="moduleState"
                    :propEditState="editState"
                    @update_criterium="updateCriterium"
                    @save_criterium="saveCriterium"
                />
            </v-col>
            <!-- Icons -->
            <v-col cols="1">
                <v-btn class="ma-2" icon @click="btnEdit()">
                    <v-icon>
                    {{ icons.mdiPencil }}
                    </v-icon>
                </v-btn>                        
            </v-col>
            <v-col cols="1">
                <v-btn class="ma-2" icon>
                    <v-icon>
                    {{ icons.mdiDelete }}
                </v-icon>
                </v-btn>                        
            </v-col>
        </v-row>         
        </v-container>
    </v-card>
</div>

</template>


<script lang="ts">
console.log("Load CriteriumListItem.vue");

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
    name: "CriteriumListItem",

    components: {
        CriteriumCard,
    },

    //PROPS
    props: {
        propCriteriumKV: {
            type: Object as () => Typ.criteriumKeyValue, 
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
            moduleState: Typ.criteriaModuleState.minimized as Typ.criteriaModuleState,      
            editState: Typ.editCriteriaModule.none as Typ.editCriteriaModule,

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
            console.log("CriteriumListBox: criterium updated!");
        },
        saveCriterium(newVal: Typ.criterium) {
            this.criteriumKV.value = newVal;

            this.$store.dispatch("updateCriterium", this.criteriumKV);

            //LOG
            console.log("CriteriumListBox: store updated");
        },
        btnEdit() {
            const appendix: number = this.criteriumKV.key;
            this.navigateTo("/CriteriumCreation/Update/" + appendix);
        },

        navigateTo(route: string) : void {
            this.$router.push(route)
        },
    },

     //WATCH
    watch: {
        propCriterium:  {
            handler(newVal: Typ.criteriumKeyValue) {
                this.criteriumKV = JSON.parse(JSON.stringify(newVal)) as Typ.criteriumKeyValue;

                //LOG
                console.log("CriteriumListItem: propCriteriumKV changed!");
            },
            deep: true,        
        },
    },
});
</script>