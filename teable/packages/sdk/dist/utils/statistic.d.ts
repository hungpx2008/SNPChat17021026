import { StatisticsFunc } from '@teable/core';
import type { IFieldInstance } from '../model';
export declare const percentFormatting: (value: number) => string | number;
export declare const bytesToMB: (bytes: number) => string;
export declare const statisticsValue2DisplayValue: (statFunc: StatisticsFunc, value: string | number | null, field: IFieldInstance) => string | null;
