import type { IRatingFieldOptions } from '@teable/core';
import { type FC } from 'react';
import type { ICellEditor } from '../type';
interface IRatingEditor extends ICellEditor<number> {
    options: IRatingFieldOptions;
    iconClassName?: string;
}
export declare const RatingEditor: FC<IRatingEditor>;
export {};
