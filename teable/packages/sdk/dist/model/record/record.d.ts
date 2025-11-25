import type { IRecord } from '@teable/core';
import { RecordCore } from '@teable/core';
import type { Doc } from 'sharedb/lib/client';
import type { ILocaleFunction } from '../../context/app/i18n';
import type { IFieldInstance } from '../field/factory';
export declare class Record extends RecordCore {
    protected doc: Doc<IRecord>;
    protected fieldMap: {
        [fieldId: string]: IFieldInstance;
    };
    private _title?;
    constructor(doc: Doc<IRecord>, fieldMap: {
        [fieldId: string]: IFieldInstance;
    });
    get title(): string | undefined;
    static isLocked(permissions: Record['permissions'], fieldId: string): boolean;
    static isHidden(permissions: Record['permissions'], fieldId: string): boolean;
    isLocked(fieldId: string): boolean;
    isHidden(fieldId: string): boolean;
    private onCommitLocal;
    private updateComputedField;
    updateCell(fieldId: string, cellValue: unknown, localization?: {
        t: ILocaleFunction;
        prefix?: string;
    }): Promise<unknown>;
}
