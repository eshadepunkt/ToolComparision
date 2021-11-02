
export enum appState {
    start,
    criteria,
    criteriumCreation,
    tools,
    toolCreation,
    compare,
    export,
}

export enum criteriumImportance {
    undefined = 0,
    unimportant = 1,
    neutral = 2,
    important = 3,
    veryimportant = 4,
}

export interface criterium {
    name: string;
    description: string;
    importance: criteriumImportance;
    isExclusionCriterium: boolean;
} 

export interface criteriumKeyValue {
    key: number;
    value: criterium;
}

export enum criteriaModuleState {
    minimized,
    maximized,
    increation,
}

export enum editCriteriaModule {
    none,
    increation,
    name,
    description,
    importance,
    isExclusionCriterium,
}

