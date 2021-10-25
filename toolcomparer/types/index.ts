enum criteriumImportance {
    unimportant = 1,
    neutral = 2,
    important = 3,
    veryimportant = 4,
}

interface criterium {
    name: string;
    description: string;
    importance: criteriumImportance;
    isExclusionCriterium: boolean;
} 


enum criteriaModuleState {
    minimized,
    maximized,
    increation,
}

