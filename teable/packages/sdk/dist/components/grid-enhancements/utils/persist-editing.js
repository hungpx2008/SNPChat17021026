import { FieldType } from '@teable/core';
import { keyBy } from 'lodash';
export const NEED_PERSIST_EDITING_FIELD_TYPES = new Set([
    FieldType.LongText,
    FieldType.SingleLineText,
    FieldType.Number,
]);
export const isNeedPersistEditing = (fields, fieldId) => {
    const fieldMap = keyBy(fields, 'id');
    const field = fieldMap[fieldId];
    return NEED_PERSIST_EDITING_FIELD_TYPES.has(field?.type);
};
