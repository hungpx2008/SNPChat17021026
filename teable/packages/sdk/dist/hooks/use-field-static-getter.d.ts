/// <reference types="react" />
import { FieldType } from '@teable/core';
export interface IFieldStatic {
    title: string;
    description: string;
    defaultOptions: unknown;
    Icon: React.FC<any>;
}
export declare const useFieldStaticGetter: () => (type: FieldType, config?: {
    isLookup?: boolean;
    isConditionalLookup?: boolean;
    hasAiConfig?: boolean;
    deniedReadRecord?: boolean;
}) => IFieldStatic;
