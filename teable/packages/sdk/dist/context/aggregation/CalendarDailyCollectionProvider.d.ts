import type { ICalendarDailyCollectionRo } from '@teable/openapi';
import type { FC, ReactNode } from 'react';
interface ICalendarDailyCollectionProviderProps {
    children: ReactNode;
    query?: ICalendarDailyCollectionRo;
}
export declare const CalendarDailyCollectionProvider: FC<ICalendarDailyCollectionProviderProps>;
export {};
