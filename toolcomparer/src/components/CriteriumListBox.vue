<template>

<div id="CriteriumListBox">
   <v-card
        min-height="100vh"
        color="grey lighten-5">
        <v-container>
            <!-- Head -->
            <v-row>
                <v-col xl="7">
                    <v-card
                        color="indigo darken-4">
                        <h1 style="text-align: center; color: white">
                            Criterias
                        </h1>
                    </v-card>
                </v-col>           
            </v-row>

            <!-- Body -->
            <v-row>
                <v-col xl="7">
                    <v-list style="height: 66vh; overflow-y: auto;">
                        <v-item v-for="(item, index) in this.criteria" :key="index">
                            <CriteriumListItem :propCriteriumKV="item" />
                        </v-item>
                    </v-list>
                </v-col>       
            </v-row>

            <!-- Buttons -->
            <v-row align="center" align-content="space-between" justify="space-between"> 
                <v-col xl="1">
                    <v-btn
                    color="red lighten-5"
                    >
                        Start-Site
                    </v-btn>
                </v-col>
                <v-col xl="1">
                    <v-btn
                        color="teal lighten-5"
                    >
                        Add Criterium
                    </v-btn>
                </v-col>
                <v-col xl="1">
                    <v-btn
                        color="blue lighten-5"
                    >
                        Add Tools
                    </v-btn>
                </v-col>
            </v-row>
            <v-row align="center" align-content="space-between" justify="space-between"> 
                <v-col xl="1">
                    <v-btn>
                        Import
                    </v-btn>
                </v-col>
                <v-col xl="1">
                    <v-btn>
                        Export
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>    
   </v-card>   
</div>
    
</template>

<script lang="ts">
console.log("Load CriteriumListBox.vue");

import * as Typ from "../types/index";
import {
    mdiAccount,
    mdiPencil,
    mdiShareVariant,
    mdiDelete,
    mdiAppleKeyboardControl,
  } from '@mdi/js';

import Vue from 'vue';


import CriteriumListItem from "./CriteriumListItem.vue";


export default Vue.extend({
    name: "CriteriumListBox",

    components: {
        CriteriumListItem,
    },

    data() {
        return {
            criteria: this.$store.getters.getCriteria as Array<Typ.criteriumKeyValue>,
        }
    }
});
</script>
