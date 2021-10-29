<template>

<div id="CriteriumListItem">
    <v-card>
        <v-container>
            <v-row>
                <v-col md="5">
                <CriteriumCard 
                    :propCriterium="criterium"
                    :propModuleState="moduleState"
                    :propEditState="editState"
                />
            </v-col>
            <!-- Icons -->
            <v-col md="1">
                <v-btn class="ma-2" icon>
                    <v-icon>
                    {{ icons.mdiPencil }}
                    </v-icon>
                </v-btn>                        
            </v-col>
            <v-col md="1">
                <v-btn class="ma-2" icon>
                    <v-icon>
                    {{ icons.delete }}
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
            criteriumKV: {} as Typ.criteriumKeyValue,
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

     //WATCH
    watch: {
        propCriterium:  {
            handler(newVal: Typ.criteriumKeyValue) {
                this.criteriumKV = newVal;

                //LOG
                console.log("CriteriumListItem propCriteriumKV changed!");
            },
            deep: true,        
        },
    },

    //MOUNTED
    mounted: function () {
        this.criteriumKV = this.propCriteriumKV;

        //LOG
        console.log("CriteriumListItem: Mounted");
    },
});
</script>