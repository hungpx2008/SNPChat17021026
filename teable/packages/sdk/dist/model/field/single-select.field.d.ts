import { SingleSelectFieldCore } from '@teable/core';
import { Field } from './field';
import { SelectFieldSdk } from './mixin/select.field';
declare const SingleSelectField_base: import("ts-mixer/dist/types/types").Class<any[], SelectFieldSdk & SingleSelectFieldCore & Field, typeof SelectFieldSdk & typeof SingleSelectFieldCore & typeof Field>;
export declare class SingleSelectField extends SingleSelectField_base {
}
export {};
