<template>

<div id="CriteriumCard">
    CriteriumCard
    <v-card>
        <v-container>
            <v-row>
                <v-col>
                    <v-card v-if="isMinimized()">
                        <div style="float: left;">
                            {{ criterium.name }}
                        </div>
                        <div style="float: right;">
                            M
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
    
</div>

</template>

<script lang="ts">
console.log("Load CriteriumCard.vue");
console.dir();

import * as Typ from "../types/index";

import Vue from 'vue';

export default Vue.extend({
    name: "CriteriumCard",
    
    data: () => ({
        moduleState: Typ.criteriaModuleState.increation as Typ.criteriaModuleState,
        criterium: {} as Typ.criterium,
    }),

    methods: {
        isMinimized(): boolean {
            return this.moduleState === Typ.criteriaModuleState.minimized;
        },
        isMaximized(orInCreation: boolean = false): boolean {

            if (orInCreation) {
                return this.moduleState === Typ.criteriaModuleState.increation;
            }

            return this.moduleState === Typ.criteriaModuleState.maximized;
        },
    },
});

</script>