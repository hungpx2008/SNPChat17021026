import { CellValueType, ColorUtils, FieldType, validateDateFieldValueLoose } from '@teable/core';
import { LRUCache } from 'lru-cache';
import { useCallback, useMemo } from 'react';
import { useTranslation } from '../../../context/app/i18n/useTranslation';
import { useFields, useView } from '../../../hooks';
import { getFileCover, isSystemFileIcon } from '../../editor';
import { GRID_DEFAULT } from '../../grid/configs';
import { CellType } from '../../grid/renderers';
import { cellDate2String, convertNextImageUrl } from '../utils';
const cellValueStringCache = new LRUCache({ max: 100 });
const { columnWidth } = GRID_DEFAULT;
const generateGroupColumns = (fields) => {
    const iconString = (type, isLookup, isConditionalLookup) => {
        if (isLookup) {
            return isConditionalLookup ? `${type}_conditional_lookup` : `${type}_lookup`;
        }
        return type;
    };
    return fields
        .map((field) => {
        if (!field)
            return;
        const { id, type, name, description, isLookup, isConditionalLookup } = field;
        return {
            id,
            name,
            width: columnWidth,
            description,
            icon: iconString(type, isLookup, isConditionalLookup),
        };
    })
        .filter(Boolean);
};
const useGenerateGroupCellFn = () => {
    const { t } = useTranslation();
    return useCallback((fields) => 
    // eslint-disable-next-line sonarjs/cognitive-complexity
    (_cellValue, depth) => {
        const field = fields[depth];
        if (field == null)
            return { type: CellType.Loading };
        const { id: fieldId, type, isMultipleCellValue: isMultiple, cellValueType } = field;
        const emptyStr = '(Empty)';
        const validateCellValue = field.cellValueType === CellValueType.DateTime
            ? validateDateFieldValueLoose(_cellValue)
            : field.validateCellValue(_cellValue);
        const cellValue = (validateCellValue.success ? validateCellValue.data : undefined);
        if (cellValue == null) {
            return {
                type: CellType.Text,
                data: emptyStr,
                displayData: emptyStr,
            };
        }
        switch (type) {
            case FieldType.SingleLineText: {
                const { showAs } = field.options;
                if (showAs != null) {
                    return {
                        type: CellType.Link,
                        data: cellValue ? (Array.isArray(cellValue) ? cellValue : [cellValue]) : [],
                        displayData: field.cellValue2String(cellValue),
                    };
                }
                return {
                    type: CellType.Text,
                    data: cellValue || emptyStr,
                    displayData: field.cellValue2String(cellValue),
                };
            }
            case FieldType.LongText: {
                return {
                    type: CellType.Text,
                    data: cellValue || emptyStr,
                    displayData: field.cellValue2String(cellValue),
                    isWrap: true,
                };
            }
            case FieldType.Date:
            case FieldType.CreatedTime:
            case FieldType.LastModifiedTime: {
                let displayData = '';
                const { date, time, timeZone } = field.options.formatting;
                const cacheKey = `${fieldId}-${cellValue}-${date}-${time}-${timeZone}`;
                if (cellValueStringCache.has(cacheKey)) {
                    displayData = cellValueStringCache.get(cacheKey) || '';
                }
                else {
                    displayData = cellDate2String(cellValue, field.options.formatting, field.isMultipleCellValue);
                    cellValueStringCache.set(cacheKey, displayData);
                }
                return {
                    type: CellType.Text,
                    data: cellValue || emptyStr,
                    displayData,
                };
            }
            case FieldType.AutoNumber: {
                return {
                    type: CellType.Number,
                    data: cellValue,
                    displayData: field.cellValue2String(cellValue),
                    contentAlign: 'left',
                };
            }
            case FieldType.Number:
            case FieldType.Rollup:
            case FieldType.Formula:
            case FieldType.ConditionalRollup: {
                if (cellValueType === CellValueType.Boolean) {
                    return {
                        type: CellType.Boolean,
                        data: cellValue || false,
                        isMultiple,
                    };
                }
                if (cellValueType === CellValueType.DateTime) {
                    return {
                        type: CellType.Text,
                        data: cellValue || emptyStr,
                        displayData: cellValue || emptyStr,
                    };
                }
                if (cellValueType === CellValueType.String) {
                    const showAs = field.options.showAs;
                    if (showAs != null) {
                        return {
                            type: CellType.Link,
                            data: cellValue ? (Array.isArray(cellValue) ? cellValue : [cellValue]) : [],
                            displayData: field.cellValue2String(cellValue),
                        };
                    }
                    return {
                        type: CellType.Text,
                        data: cellValue || emptyStr,
                        displayData: field.cellValue2String(cellValue),
                    };
                }
                const optionShowAs = field.options.showAs;
                const showAs = optionShowAs == null
                    ? undefined
                    : {
                        ...optionShowAs,
                        color: ColorUtils.getHexForColor(optionShowAs.color),
                    };
                if (showAs && isMultiple && Array.isArray(cellValue)) {
                    return {
                        type: CellType.Chart,
                        data: cellValue,
                        displayData: cellValue.map((v) => field.item2String(v)),
                        chartType: showAs.type,
                        color: showAs.color,
                    };
                }
                return {
                    type: CellType.Number,
                    data: cellValue,
                    displayData: isMultiple && Array.isArray(cellValue)
                        ? cellValue.map((v) => field.item2String(v))
                        : field.cellValue2String(cellValue),
                    showAs: showAs,
                    contentAlign: 'left',
                };
            }
            case FieldType.MultipleSelect:
            case FieldType.SingleSelect: {
                const data = cellValue ? (Array.isArray(cellValue) ? cellValue : [cellValue]) : [];
                return {
                    type: CellType.Select,
                    data,
                    displayData: data,
                    choiceSorted: field.options.choices,
                    choiceMap: field.displayChoiceMap,
                    isMultiple,
                };
            }
            case FieldType.Link: {
                const cv = cellValue ? (Array.isArray(cellValue) ? cellValue : [cellValue]) : [];
                const displayData = cv.map(({ title }) => title || t('common.untitled'));
                const choices = cv.map(({ id, title }) => ({ id, name: title }));
                return {
                    type: CellType.Select,
                    data: cv,
                    displayData,
                    choiceSorted: choices,
                    isMultiple,
                };
            }
            case FieldType.Attachment: {
                const cv = (cellValue ?? []);
                const data = cv.map(({ id, mimetype, presignedUrl, smThumbnailUrl }) => {
                    const url = getFileCover(mimetype, presignedUrl);
                    return {
                        id,
                        url: isSystemFileIcon(mimetype) ? url : smThumbnailUrl ?? url,
                    };
                });
                const displayData = data.map(({ url }) => url);
                return {
                    type: CellType.Image,
                    data,
                    displayData,
                };
            }
            case FieldType.Checkbox: {
                return {
                    type: CellType.Boolean,
                    data: cellValue || false,
                    isMultiple,
                    contentAlign: 'left',
                };
            }
            case FieldType.Rating: {
                const { icon, color, max } = field.options;
                if (isMultiple) {
                    return {
                        type: CellType.Number,
                        data: cellValue,
                        displayData: field.cellValue2String(cellValue),
                        contentAlign: 'left',
                    };
                }
                return {
                    type: CellType.Rating,
                    data: cellValue || 0,
                    icon,
                    color: ColorUtils.getHexForColor(color),
                    max,
                };
            }
            case FieldType.User:
            case FieldType.CreatedBy:
            case FieldType.LastModifiedBy: {
                const cv = cellValue ? (Array.isArray(cellValue) ? cellValue : [cellValue]) : [];
                const data = cv.map((item) => {
                    const { title, avatarUrl } = item;
                    return {
                        ...item,
                        name: title,
                        avatarUrl: convertNextImageUrl({
                            url: avatarUrl,
                            w: 64,
                            q: 100,
                        }),
                    };
                });
                return {
                    type: CellType.User,
                    data: data,
                };
            }
            default: {
                return { type: CellType.Loading };
            }
        }
    }, [t]);
};
export const useGridGroupCollection = () => {
    const view = useView();
    const group = view?.group;
    const fields = useFields({ withHidden: true, withDenied: true });
    const groupFields = useMemo(() => {
        if (!group?.length)
            return [];
        return group
            .map(({ fieldId }) => fields.find((f) => f.id === fieldId))
            .filter(Boolean);
    }, [fields, group]);
    const generateGroupCellFn = useGenerateGroupCellFn();
    return useMemo(() => ({
        groupColumns: generateGroupColumns(groupFields),
        getGroupCell: generateGroupCellFn(groupFields),
    }), [generateGroupCellFn, groupFields]);
};
