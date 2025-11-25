import { CalendarViewCore } from '@teable/core';
import { View } from './view';
declare const CalendarView_base: import("ts-mixer/dist/types/types").Class<any[], CalendarViewCore & View, typeof CalendarViewCore & typeof View>;
export declare class CalendarView extends CalendarView_base {
    updateOption({ startDateFieldId, endDateFieldId, titleFieldId, colorConfig, }: CalendarView['options']): Promise<import("axios").AxiosResponse<void, any>>;
}
export {};
