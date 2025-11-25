import { MultipleSelectFieldCore } from '@teable/core';
import { Field } from './field';
import { SelectFieldSdk } from './mixin/select.field';
declare const MultipleSelectField_base: import("ts-mixer/dist/types/types").Class<any[], SelectFieldSdk & MultipleSelectFieldCore & Field, typeof SelectFieldSdk & typeof MultipleSelectFieldCore & typeof Field>;
export declare class MultipleSelectField extends MultipleSelectField_base {
}
export {};
