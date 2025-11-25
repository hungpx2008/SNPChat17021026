import { SelectFieldCore } from '@teable/core';
export interface ISelectFieldDisplayChoice {
    id: string;
    name: string;
    color: string;
    backgroundColor: string;
}
export declare abstract class SelectFieldSdk extends SelectFieldCore {
    private _choiceMap;
    get displayChoiceMap(): Record<string, ISelectFieldDisplayChoice>;
}
