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

export enum criteriaModuleState {
  minimized,
  maximized,
  increation,
}
