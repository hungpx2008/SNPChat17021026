import type { IButtonFieldCellValue } from '@teable/core';
import { type FC } from 'react';
import type { IButtonClickStatusHook } from '../../../hooks';
import type { ButtonField } from '../../../model/field/button.field';
import type { ICellEditor } from '../type';
interface IButtonEditor extends ICellEditor<IButtonFieldCellValue> {
    field: ButtonField;
    recordId?: string;
    statusHook?: IButtonClickStatusHook;
}
export declare const ButtonEditor: FC<IButtonEditor>;
export {};
