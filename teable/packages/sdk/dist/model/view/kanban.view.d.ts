import { KanbanViewCore } from '@teable/core';
import { View } from './view';
declare const KanbanView_base: import("ts-mixer/dist/types/types").Class<any[], KanbanViewCore & View, typeof KanbanViewCore & typeof View>;
export declare class KanbanView extends KanbanView_base {
    updateOption({ stackFieldId, coverFieldId, isCoverFit, isFieldNameHidden, isEmptyStackHidden, }: KanbanView['options']): Promise<import("axios").AxiosResponse<void, any>>;
}
export {};
