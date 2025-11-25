import { formatDateToString } from '@teable/core';
import { omit } from 'lodash';
export const cellDate2String = (cellValue, formatting, isMultipleCellValue) => {
    if (cellValue == null)
        return '';
    if (isMultipleCellValue && Array.isArray(cellValue)) {
        return cellValue
            .map((v) => formatDateToString(v, omit(formatting, 'timeZone')))
            .join(', ');
    }
    return formatDateToString(cellValue, omit(formatting, 'timeZone'));
};
