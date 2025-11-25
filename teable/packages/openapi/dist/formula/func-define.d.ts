import { FunctionName, FUNCTIONS, CellValueType } from '@teable/core';
export interface IFunctionSchema<T extends FunctionName> {
    name: T;
    func: (typeof FUNCTIONS)[T];
    params: string[];
    definition: string;
    returnType?: CellValueType | 'array';
    summary: string;
    example: string;
}
export declare const funcDefine: [
    FunctionName,
    Omit<IFunctionSchema<FunctionName>, 'summary' | 'example'>
][];
