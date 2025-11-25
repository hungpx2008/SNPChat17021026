import { GalleryViewCore } from '@teable/core';
import { View } from './view';
declare const GalleryView_base: import("ts-mixer/dist/types/types").Class<any[], GalleryViewCore & View, typeof GalleryViewCore & typeof View>;
export declare class GalleryView extends GalleryView_base {
    updateOption({ coverFieldId, isCoverFit, isFieldNameHidden }: GalleryView['options']): Promise<import("axios").AxiosResponse<void, any>>;
}
export {};
