import { FormViewCore } from '@teable/core';
import { View } from './view';
declare const FormView_base: import("ts-mixer/dist/types/types").Class<any[], FormViewCore & View, typeof FormViewCore & typeof View>;
export declare class FormView extends FormView_base {
    updateOption({ coverUrl, logoUrl, submitLabel }: FormView['options']): Promise<import("axios").AxiosResponse<void, any>>;
}
export {};
