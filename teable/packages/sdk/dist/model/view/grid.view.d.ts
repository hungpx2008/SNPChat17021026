import { GridViewCore } from '@teable/core';
import { View } from './view';
declare const GridView_base: import("ts-mixer/dist/types/types").Class<any[], GridViewCore & View, typeof GridViewCore & typeof View>;
export declare class GridView extends GridView_base {
    updateOption({ rowHeight, frozenColumnCount, fieldNameDisplayLines }: GridView['options']): Promise<import("axios").AxiosResponse<void, any>>;
}
export {};
