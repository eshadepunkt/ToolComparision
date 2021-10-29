<template>

<v-form  ref="form" lazy-validation v-model="isValid" id="CriteriumCard">
    <!-- Fast Debug Settings -->
    <div v-if="debug">
        <v-select
            :items="debugItems"
            label="Module State"
            v-model="selectedDebugItem"
            @change="changeModuleState(selectedDebugItem)"
        >
        </v-select>
    </div>
  
    <v-card>
        <v-container>
            <!-- Head -->
            <v-row>        
                <v-col cols="9">
                    <!-- Minimized -->
                    <div v-if="isMinimized()" style="font-size: 1.5em; position: relative; top: 0.5em;">
                        {{ criterium.name }}
                    </div>
                    <!-- Maximized -->
                    <v-text-field v-else
                            v-model="criterium.name"
                            :rules="rules.str"
                            label="Criterium name"
                            required
                            :readonly="!canEdit('name')"
                    >
                    </v-text-field>      
                </v-col>
                <!-- Icons -->
                <v-col cols="1">
                    <v-btn  v-if="!isMinimized() && !isInCreation()"  class="ma-2"
                        icon @click="changeEditMode('name')">
                        <v-icon>
                        {{ icons.mdiPencil }}
                    </v-icon>
                    </v-btn>                        
                </v-col>
                <v-col cols="1">
                    <v-btn v-if="!isInCreation()" class="ma-2" v-bind:style="isMinimized() ? 'transform: scaleY(-1);' : ''"
                        icon @click="[isMinimized() ? changeModuleState('maximized') : changeModuleState('minimized')]">
                    <v-icon >
                        {{ icons.mdiAppleKeyboardControl  }}
                    </v-icon>
                    </v-btn>                        
                </v-col>
            </v-row>
            
            <!-- Body -->

            <!-- Description -->
            <v-row v-if="!isMinimized()">
                <v-col cols="9">
                    <v-textarea
                        outlined
                        label="Description"
                        v-model="criterium.description"
                        :rules="rules.str"            
                        required
                        :readonly="!canEdit('description')"
                    >
                    </v-textarea>
                </v-col>
                <!-- Icons -->
                <v-col cols="1">
                    <v-btn  v-if="!isMinimized() && !isInCreation()"  class="ma-2"
                        icon @click="changeEditMode('description')">
                        <v-icon>
                        {{ icons.mdiPencil }}
                    </v-icon>
                    </v-btn>                        
                </v-col>
                <v-col sm="1" xl="1" />
            </v-row>

            <!-- Importance -->
            <v-row v-if="!isMinimized()">
                <v-col cols="9">
                    <v-select
                        :items="importanceItems"
                        label="Importance"
                        v-model="selectedImportance"
                        :rules="rules.str"    
                        required
                        :readonly="!canEdit('importance')"
                        @change="updateImportance(selectedImportance)"
                    >
                    </v-select>
                </v-col>
                <!-- Icons -->
                <v-col cols="1">
                    <v-btn  v-if="!isMinimized() && !isInCreation()"  class="ma-2"
                        icon @click="changeEditMode('importance')">
                        <v-icon>
                        {{ icons.mdiPencil }}
                    </v-icon>
                    </v-btn>                        
                </v-col>
                <v-col sm="1" xl="1" />
            </v-row>

            <!-- Exclusion Criterium -->
            <v-row v-if="!isMinimized()">
                <v-col cols="9">
                    <v-checkbox
                        label="Exclusion Criterium"
                        v-model="criterium.isExclusionCriterium"
                        :readonly="!canEdit('isExclusionCriterium')"
                    >
                    </v-checkbox>
                </v-col>
                <!-- Icons -->
                <v-col cols="1">
                    <v-btn  v-if="!isMinimized() && !isInCreation()"  class="ma-2"
                        icon @click="changeEditMode('isExclusionCriterium')">
                        <v-icon>
                        {{ icons.mdiPencil }}
                    </v-icon>
                    </v-btn>                        
                </v-col>
                <v-col sm="1" xl="1" />
            </v-row>
        </v-container>
    </v-card>   
</v-form>

</template>

<script lang="ts">
console.log("Load CriteriumCard.vue");
console.dir();

import * as Typ from "../types/index";
import {
    mdiAccount,
    mdiPencil,
    mdiShareVariant,
    mdiDelete,
    mdiAppleKeyboardControl,
  } from '@mdi/js';

import Vue from 'vue';



export default Vue.extend({
    name: "CriteriumCard",

    //PROPS
    props: {
        propCriterium: {
            type: Object as () => Typ.criterium, 
            default: {
                name: "",
                description: "",
                importance: Typ.criteriumImportance.undefined,
                isExclusionCriterium: false
            } as Typ.criterium
        },
        propModuleState: {
            type: Object as () => Typ.criteriaModuleState, 
            default: Typ.criteriaModuleState.increation as Typ.criteriaModuleState,
        },
        propEditState:  {
            type: Object as () => Typ.editCriteriaModule, 
            default: Typ.editCriteriaModule.increation as Typ.editCriteriaModule,
        },
    },

    //METHODS
    methods: {
        isMinimized(): boolean {
            return this.moduleState === Typ.criteriaModuleState.minimized;
        },
        isInCreation(): boolean {
            return this.moduleState === Typ.criteriaModuleState.increation;
        },
        changeModuleState(state: string): void {      
            //Log
            console.log("CriteriumCard: change module state from '" + 
                Typ.criteriaModuleState[this.moduleState] + "' to '" + state  + "'");

            var stateEnum = this.convertStringToModuleStateEnum(state);
            this.moduleState = stateEnum;

            if (this.moduleState === Typ.criteriaModuleState.increation) {
                this.editState = Typ.editCriteriaModule.increation;
            }
            else {
                this.editState = Typ.editCriteriaModule.none;
            }
       
            //Log
            console.log("CriteriumCard: changed edit mode to '" + 
                Typ.editCriteriaModule[this.editState] + "'");
        },    
        convertStringToModuleStateEnum(convert: string) : Typ.criteriaModuleState {  
            //Log
            console.log("CriteriumCard: convert string '" + 
                convert + "' to moduleStateEnum");
            
            this.selectedDebugItem = convert;

            switch (convert) {
                case "minimized":
                    return Typ.criteriaModuleState.minimized;
                case "maximized":
                    return Typ.criteriaModuleState.maximized;
                default:
                    return Typ.criteriaModuleState.increation;
            }           
        },

        changeEditMode(mode: string) : void {      
            //Log
            console.log("CriteriumCard: change edit mode from '" + 
                Typ.editCriteriaModule[this.editState] + "' to '" + mode  + "'");

            var modeEnum: Typ.editCriteriaModule = this.convertStringToEditModeEnum(mode);

            this.editState = modeEnum;
        },
        canEdit(sender: string) : boolean {
            //Log
            console.log("CriteriumCard: request edit mode from '" + 
                sender + "'; current: '" + Typ.editCriteriaModule[this.editState] + "'");

            var senderEnum: Typ.editCriteriaModule = this.convertStringToEditModeEnum(sender);
            if (this.editState === Typ.editCriteriaModule.increation) {
                return true;
            }

            return senderEnum === this.editState;
        },
        convertStringToEditModeEnum(convert: string) : Typ.editCriteriaModule { 
            //Log 
            console.log("CriteriumCard: convert string '" + 
                convert + "' to editEnum");
            
            switch (convert) {
                case "increation":
                    return Typ.editCriteriaModule.increation;
                case "name":
                    return Typ.editCriteriaModule.name;
                case "description":
                    return Typ.editCriteriaModule.description;
                case "importance":
                    return Typ.editCriteriaModule.importance;
                case "isExclusionCriterium":
                    return Typ.editCriteriaModule.isExclusionCriterium;
                default:
                    return Typ.editCriteriaModule.none;
            }           
        },

        updateImportance(importance: string): void {
             //Log
            console.log("CriteriumCard: update criterium importance from '" + 
                Typ.criteriumImportance[this.criterium.importance] + "' to '" + importance  + "'");

            var importanceEnum: Typ.criteriumImportance = this.convertStringToImportanceEnum(importance);
            this.criterium.importance = importanceEnum;

        },
        convertStringToImportanceEnum(convert: string): Typ.criteriumImportance {
            //Log 
            console.log("CriteriumCard: convert string '" + 
                convert + "' to importanceEnum");
            
            switch (convert) {
                case "very important":
                    return Typ.criteriumImportance.veryimportant;
                case "important":
                    return Typ.criteriumImportance.important;
                case "neutral":
                    return Typ.criteriumImportance.neutral;
                default:
                    return Typ.criteriumImportance.unimportant;
            }
        },

        validate(): boolean {
            return (this.$refs.form as Vue & { validate: () => boolean }).validate();
        },

        resetValidation() {
            (this.$refs.form as Vue & { resetValidation: () => void }).resetValidation();
        },

        reset() {
            (this.$refs.form as Vue & { reset: () => void }).reset();
        }
    },

    //DATA
    data() {
        return {
            criterium: {} as Typ.criterium,
            moduleState: this.propModuleState as Typ.criteriaModuleState,      
            editState: this.propEditState as Typ.editCriteriaModule,

            importanceItems: ['very important', 'important', 'neutral', 'unimportant'] as string[],
            selectedImportance: '' as string,

            rules: {
                required: (value: boolean | string) => !!value || 'Required',
                str: [(val: string) => (val || '').length > 0 || 'This field is required'],
            },
            icons: {
                mdiAccount,
                mdiPencil,
                mdiShareVariant,
                mdiDelete,
                mdiAppleKeyboardControl,
            },

            isValid: true as boolean,

            debug: true as boolean,
            debugItems: ['minimized', 'maximized', 'increation' ] as string[],
            selectedDebugItem: "" as string,
        }        
    },

    //WATCH
    watch: {
        propCriterium:  {
            handler(newVal: Typ.criterium) {
                this.criterium = newVal;

                //LOG
                console.log("CriteriumCard: propCriterium changed!");
            },
            deep: true,        
        },
        criterium:  {
            handler(newVal: Typ.criterium) {
                this.$emit('update_criterium', newVal);

                //LOG
                console.log("CriteriumCard: criterium changed!");
            },
            deep: true,        
        },
    },

    //MOUNTED
    mounted: function () {
        this.criterium = this.propCriterium;
        this.moduleState = this.propModuleState;
        this.editState = this.propEditState;

        this.resetValidation();

        //(this.$refs.form as Vue & { validate: () => boolean }).validate();
        //LOG
        console.log("CriteriumCard: Mounted");
    },
});

</script>