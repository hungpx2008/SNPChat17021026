import { FieldType } from '@teable/core';
import type { IFieldInstance } from '../../../model';
export declare const NEED_PERSIST_EDITING_FIELD_TYPES: Set<FieldType>;
export declare const isNeedPersistEditing: (fields: IFieldInstance[], fieldId: string) => boolean;
