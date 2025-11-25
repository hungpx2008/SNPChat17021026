import { RowHeightLevel } from '@teable/core';
import type { ICell, IGridColumn } from '../..';
import type { IButtonClickStatusHook } from '../../../hooks';
import type { IFieldInstance, Record } from '../../../model';
export declare const useCreateCellValue2GridDisplay: (rowHeight?: RowHeightLevel, recordEditable?: boolean) => (fields: IFieldInstance[]) => (record: Record, col: number, isPrefilling?: boolean, expandRecord?: ((tableId: string, recordId: string) => void) | undefined, buttonClickStatusHook?: IButtonClickStatusHook) => ICell;
export declare function useGridColumns(hasMenu?: boolean, hiddenFieldIds?: string[]): {
    columns: (IGridColumn & {
        id: string;
    })[];
    cellValue2GridDisplay: (record: Record, col: number, isPrefilling?: boolean | undefined, expandRecord?: ((tableId: string, recordId: string) => void) | undefined, buttonClickStatusHook?: {
        checkLoading: (fieldId: string, recordId: string) => boolean;
        buttonClick: (ro: {
            tableId: string;
            recordId: string;
            fieldId: string;
            name: string;
        }) => Promise<import("axios").AxiosResponse<{
            record: {
                id: string;
                fields: globalThis.Record<string, unknown>;
                createdTime?: string | undefined;
                lastModifiedTime?: string | undefined;
                createdBy?: string | undefined;
                lastModifiedBy?: string | undefined;
                autoNumber?: number | undefined;
                name?: string | undefined;
                permissions?: globalThis.Record<string, globalThis.Record<string, boolean>> | undefined;
                undeletable?: boolean | undefined;
            };
            tableId: string;
            fieldId: string;
            runId: string;
        }, any>>;
    } | undefined) => ICell;
};
