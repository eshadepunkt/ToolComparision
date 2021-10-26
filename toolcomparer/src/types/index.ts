export enum criteriumImportance {
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


export enum criteriaModuleState {
    minimized,
    maximized,
    increation,
}

