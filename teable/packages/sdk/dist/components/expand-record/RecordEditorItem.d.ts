import type { IButtonClickStatusHook } from '../../hooks';
import type { Field, Record } from '../../model';
export declare const RecordEditorItem: (props: {
    field: Field;
    record: Record | undefined;
    vertical?: boolean | undefined;
    onChange?: ((newValue: unknown, fieldId: string) => void) | undefined;
    readonly?: boolean | undefined;
    buttonClickStatusHook?: {
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
    } | undefined;
}) => import("react/jsx-runtime").JSX.Element;
