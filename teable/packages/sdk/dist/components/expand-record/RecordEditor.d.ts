import type { IButtonClickStatusHook } from '../../hooks';
import type { IFieldInstance, Record } from '../../model';
export declare const RecordEditor: (props: {
    fields: IFieldInstance[];
    record: Record | undefined;
    hiddenFields?: (import("../../model").AttachmentField | import("../../model").AutoNumberField | import("../../model/field/button.field").ButtonField | import("../../model").CheckboxField | import("../../model").ConditionalRollupField | import("../../model").CreatedByField | import("../../model").CreatedTimeField | import("../../model").DateField | import("../../model").FormulaField | import("../../model").LastModifiedByField | import("../../model").LastModifiedTimeField | import("../../model").LinkField | import("../../model").LongTextField | import("../../model").MultipleSelectField | import("../../model").NumberField | import("../../model").RatingField | import("../../model").RollupField | import("../../model").SingleLineTextField | import("../../model").SingleSelectField | import("../../model").UserField)[] | undefined;
    onChange?: ((newValue: unknown, fieldId: string) => void) | undefined;
    readonly?: boolean | ((field: IFieldInstance) => boolean) | undefined;
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
