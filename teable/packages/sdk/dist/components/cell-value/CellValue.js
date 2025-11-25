import { jsx as _jsx } from "react/jsx-runtime";
import { CellValueType, FieldType } from '@teable/core';
import { cn } from '@teable/ui-lib';
import { CellAttachment } from './cell-attachment';
import { CellButton } from './cell-button';
import { CellCheckbox } from './cell-checkbox';
import { CellDate } from './cell-date';
import { CellLink } from './cell-link';
import { CellNumber } from './cell-number';
import { CellRating } from './cell-rating';
import { CellSelect, transformSelectOptions } from './cell-select';
import { CellText } from './cell-text';
import { CellUser } from './cell-user';
export const CellValue = (props) => {
    const { field, value, ellipsis, className, itemClassName, formatImageUrl, readonly } = props;
    const { type, options, cellValueType, isLookup } = field;
    switch (type) {
        case FieldType.LongText: {
            return (_jsx(CellText, { value: value, className: cn(className, 'line-clamp-none'), ellipsis: ellipsis }));
        }
        case FieldType.SingleLineText: {
            return (_jsx(CellText, { value: value, className: className, ellipsis: ellipsis, displayType: options.showAs?.type }));
        }
        case FieldType.Number: {
            return (_jsx(CellNumber, { value: value, formatting: options.formatting, className: className, ellipsis: ellipsis }));
        }
        case FieldType.AutoNumber: {
            return _jsx(CellNumber, { value: value, ellipsis: ellipsis, className: className });
        }
        case FieldType.Date:
        case FieldType.CreatedTime:
        case FieldType.LastModifiedTime: {
            return (_jsx(CellDate, { value: value, formatting: options.formatting, ellipsis: ellipsis, className: className }));
        }
        case FieldType.SingleSelect:
        case FieldType.MultipleSelect: {
            return (_jsx(CellSelect, { value: value, options: transformSelectOptions(options.choices), className: className, itemClassName: itemClassName, ellipsis: ellipsis }));
        }
        case FieldType.User:
        case FieldType.CreatedBy:
        case FieldType.LastModifiedBy: {
            return (_jsx(CellUser, { value: value, className: className, itemClassName: itemClassName, formatImageUrl: formatImageUrl }));
        }
        case FieldType.Attachment: {
            return (_jsx(CellAttachment, { value: value, className: className, itemClassName: itemClassName, formatImageUrl: formatImageUrl }));
        }
        case FieldType.Rating: {
            return (_jsx(CellRating, { value: value, options: options, className: className, itemClassName: itemClassName }));
        }
        case FieldType.Checkbox: {
            return _jsx(CellCheckbox, { value: value, className: className });
        }
        case FieldType.Button: {
            return (_jsx(CellButton, { value: value, className: className, options: options, readonly: readonly, isLookup: isLookup }));
        }
        case FieldType.Formula:
        case FieldType.Rollup:
        case FieldType.ConditionalRollup: {
            if (cellValueType === CellValueType.Boolean) {
                return _jsx(CellCheckbox, { value: value, className: className });
            }
            if (cellValueType === CellValueType.DateTime) {
                return (_jsx(CellDate, { value: value, formatting: options.formatting, className: className, ellipsis: ellipsis }));
            }
            if (cellValueType === CellValueType.Number) {
                return (_jsx(CellNumber, { value: value, formatting: options.formatting, className: className, ellipsis: ellipsis }));
            }
            return (_jsx(CellText, { value: value, className: className, ellipsis: ellipsis, displayType: options.showAs?.type }));
        }
        case FieldType.Link: {
            return (_jsx(CellLink, { value: value, className: className, itemClassName: itemClassName }));
        }
        default:
            throw new Error(`The field type (${type}) is not implemented cell value`);
    }
};
