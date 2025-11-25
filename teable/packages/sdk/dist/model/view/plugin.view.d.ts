import { PluginViewCore } from '@teable/core';
import type { AxiosResponse } from 'axios';
import { View } from './view';
declare const PluginView_base: import("ts-mixer/dist/types/types").Class<any[], PluginViewCore & View, typeof PluginViewCore & typeof View>;
export declare class PluginView extends PluginView_base {
    updateOption(_options: unknown): Promise<AxiosResponse<void, unknown>>;
}
export {};
