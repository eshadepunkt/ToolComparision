export enum appState {
  start,
  criteria,
  criteriumCreation,
  tools,
  toolCreation,
  compare,
  export,
}

export enum simpleModuleState {
  minimized,
  maximized,
  increation,
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
  key: string;
  value: criterium;
}

export function isCriteriumKV(check: any): boolean {
  const type = check as criteriumKeyValue;

  return (
    type.key !== undefined &&
    type.value !== undefined &&
    type.value.importance !== undefined &&
    type.value.isExclusionCriterium !== undefined &&
    type.value.description !== undefined &&
    type.value.name !== undefined
  );
}






export enum toolCriteriumFullfillment {
  undefined = 0,
  verybad = 1,
  bad = 2,
  normal = 3,
  good = 4,
  verygood = 5,
}

export interface toolCriteriumSuitability {
  criterium: criteriumKeyValue;
  fullfilment: toolCriteriumFullfillment;
  justification: string;
}

export interface tool {
  name: string;
  description: string;
  criteriaSuitabilities: Array<toolCriteriumSuitability>;
}

export interface toolKeyValue {
  key: string;
  value: tool;
}
