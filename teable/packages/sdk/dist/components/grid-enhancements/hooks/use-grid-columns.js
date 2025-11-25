import { jsx as _jsx } from "react/jsx-runtime";
import { RowHeightLevel, CellValueType, ColorUtils, FieldType, checkButtonClickable, } from '@teable/core';
import { useTheme } from '@teable/next-themes';
import { keyBy } from 'lodash';
import { LRUCache } from 'lru-cache';
import { useCallback, useMemo } from 'react';
import colors from 'tailwindcss/colors';
import { CellType, hexToRGBA, getFileCover, isSystemFileIcon, convertNextImageUrl, onMixedTextClick, } from '../..';
import { useTranslation } from '../../../context/app/i18n/useTranslation';
import { useFields, useTablePermission, useView } from '../../../hooks';
import { getFilterFieldIds } from '../../filter/view-filter/utils';
import { GRID_DEFAULT } from '../../grid/configs';
import { useAttachmentPreviewI18Map } from '../../hooks';
import { GridAttachmentEditor, GridDateEditor, GridLinkEditor, GridNumberEditor, GridSelectEditor, expandPreviewModal, } from '../editor';
import { GridUserEditor } from '../editor/GridUserEditor';
import { useBuildBaseAgentStore } from '../store/useBuildBaseAgentStore';
const cellValueStringCache = new LRUCache({ max: 1000 });
const iconString = (type, isLookup, isConditionalLookup) => {
    if (isLookup) {
        return isConditionalLookup ? `${type}_conditional_lookup` : `${type}_lookup`;
    }
    return type;
};
const getColumnThemeByField = ({ field, theme, sortFieldIds, groupFieldIds, filterFieldIds, }) => {
    const { id, isPending, hasError } = field;
    const { orange, green, violet, rose, yellow } = colors;
    const isDark = theme === 'dark';
    const color_50 = isDark ? 700 : 50;
    const color_100 = isDark ? 500 : 100;
    const color_200 = isDark ? 400 : 200;
    const opacity = isDark ? 0.3 : 0.8;
    const colorMap = {
        sort: orange,
        group: green,
        filter: violet,
    };
    let customTheme = undefined;
    let conditionColorObj = undefined;
    if (groupFieldIds?.has(id)) {
        conditionColorObj = colorMap.group;
    }
    if (sortFieldIds?.has(id)) {
        conditionColorObj = colorMap.sort;
    }
    if (filterFieldIds?.has(id)) {
        conditionColorObj = colorMap.filter;
    }
    if (conditionColorObj != null) {
        customTheme = {
            cellBg: hexToRGBA(conditionColorObj[color_50], opacity),
            cellBgHovered: hexToRGBA(conditionColorObj[color_50], opacity),
            cellBgSelected: hexToRGBA(conditionColorObj[color_100], opacity),
            columnHeaderBg: hexToRGBA(conditionColorObj[color_100], opacity),
            columnHeaderBgHovered: hexToRGBA(conditionColorObj[color_200], opacity),
            columnHeaderBgSelected: hexToRGBA(conditionColorObj[color_200], opacity),
        };
    }
    if (hasError || isPending) {
        const colorObj = hasError ? rose : yellow;
        customTheme = {
            ...customTheme,
            columnHeaderBg: hexToRGBA(colorObj[color_100], opacity),
            columnHeaderBgHovered: hexToRGBA(colorObj[color_200], opacity),
            columnHeaderBgSelected: hexToRGBA(colorObj[color_200], opacity),
        };
    }
    return customTheme;
};
const useGenerateColumns = () => {
    const { t } = useTranslation();
    return useCallback(({ fields, view, theme, hasMenu = true, sortFieldIds, groupFieldIds, filterFieldIds, }) => {
        return fields
            .map((field, i) => {
            if (!field)
                return undefined;
            const columnMeta = view?.columnMeta[field.id] ?? null;
            const width = columnMeta?.width || GRID_DEFAULT.columnWidth;
            const { id, type, name, description, isLookup, isPrimary, notNull } = field;
            const customTheme = getColumnThemeByField({
                field,
                theme,
                sortFieldIds,
                groupFieldIds,
                filterFieldIds,
            });
            return {
                id,
                name: notNull ? `${name} *` : name,
                width,
                description,
                customTheme,
                isPrimary,
                hasMenu,
                statisticLabel: {
                    showAlways: i === 0,
                    label: i === 0 ? t('common.summaryTip') : t('common.summary'),
                },
                icon: field.aiConfig != null ? 'ai' : iconString(type, isLookup, field.isConditionalLookup),
            };
        })
            .filter(Boolean)
            .filter((field) => {
            if (field) {
                return !view?.columnMeta?.[field?.id]?.hidden;
            }
            return false;
        });
    }, [t]);
};
export const useCreateCellValue2GridDisplay = (rowHeight, recordEditable) => {
    const { t } = useTranslation();
    const i18nMap = useAttachmentPreviewI18Map();
    return useCallback((fields) => (record, col, isPrefilling, expandRecord, buttonClickStatusHook
    // eslint-disable-next-line sonarjs/cognitive-complexity
    ) => {
        const field = fields[col];
        if (field == null)
            return { type: CellType.Loading };
        const { id: fieldId, type, isComputed, isMultipleCellValue: isMultiple, cellValueType, } = field;
        let cellValue = record.getCellValue(fieldId);
        const validateCellValue = field.validateCellValue(cellValue);
        cellValue = validateCellValue.success ? validateCellValue.data : undefined;
        const recordReadOnly = !recordEditable && !isPrefilling;
        const fieldLocked = record.isLocked(fieldId) && !isPrefilling;
        const readonly = isComputed || recordReadOnly || fieldLocked;
        const cellId = `${record.id}-${fieldId}`;
        const baseCellProps = { id: cellId, readonly, locked: fieldLocked };
        const isHidden = record.isHidden(fieldId);
        if (isHidden) {
            return {
                ...baseCellProps,
                type: CellType.Text,
                data: '',
                displayData: '',
                hidden: true,
            };
        }
        switch (type) {
            case FieldType.SingleLineText: {
                const { showAs } = field.options;
                if (showAs != null) {
                    const { type } = showAs;
                    return {
                        ...baseCellProps,
                        type: CellType.Link,
                        data: cellValue ? (Array.isArray(cellValue) ? cellValue : [cellValue]) : [],
                        displayData: field.cellValue2String(cellValue),
                        onClick: (text) => onMixedTextClick(type, text),
                    };
                }
                return {
                    ...baseCellProps,
                    type: CellType.Text,
                    data: cellValue || '',
                    displayData: field.cellValue2String(cellValue),
                };
            }
            case FieldType.LongText: {
                return {
                    ...baseCellProps,
                    type: CellType.Text,
                    data: cellValue || '',
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
                    displayData = field.cellValue2String(cellValue);
                    cellValueStringCache.set(cacheKey, displayData);
                }
                if (type === FieldType.CreatedTime || type === FieldType.LastModifiedTime) {
                    return {
                        ...baseCellProps,
                        type: CellType.Text,
                        data: cellValue || '',
                        displayData,
                    };
                }
                return {
                    ...baseCellProps,
                    type: CellType.Text,
                    data: cellValue || '',
                    displayData,
                    customEditor: (props, editorRef) => (_jsx(GridDateEditor, { ref: editorRef, field: field, record: record, ...props })),
                };
            }
            case FieldType.AutoNumber: {
                return {
                    ...baseCellProps,
                    type: CellType.Number,
                    data: cellValue,
                    displayData: field.cellValue2String(cellValue),
                };
            }
            case FieldType.Number:
            case FieldType.Rollup:
            case FieldType.Formula:
            case FieldType.ConditionalRollup: {
                if (cellValueType === CellValueType.Boolean) {
                    return {
                        ...baseCellProps,
                        type: CellType.Boolean,
                        data: cellValue || false,
                        isMultiple,
                    };
                }
                if (cellValueType === CellValueType.DateTime) {
                    return {
                        ...baseCellProps,
                        type: CellType.Text,
                        data: cellValue || '',
                        displayData: field.cellValue2String(cellValue),
                    };
                }
                if (cellValueType === CellValueType.String) {
                    const showAs = field.options.showAs;
                    if (showAs != null) {
                        const { type } = showAs;
                        return {
                            ...baseCellProps,
                            type: CellType.Link,
                            data: cellValue ? (Array.isArray(cellValue) ? cellValue : [cellValue]) : [],
                            displayData: field.cellValue2String(cellValue),
                            onClick: (text) => onMixedTextClick(type, text),
                        };
                    }
                    return {
                        ...baseCellProps,
                        type: CellType.Text,
                        data: cellValue || '',
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
                        ...baseCellProps,
                        type: CellType.Chart,
                        data: cellValue,
                        displayData: cellValue.map((v) => field.item2String(v)),
                        chartType: showAs.type,
                        color: showAs.color,
                    };
                }
                return {
                    ...baseCellProps,
                    type: CellType.Number,
                    data: cellValue,
                    displayData: isMultiple && Array.isArray(cellValue)
                        ? cellValue.map((v) => field.item2String(v))
                        : field.cellValue2String(cellValue),
                    showAs: showAs,
                    customEditor: (props, editorRef) => (_jsx(GridNumberEditor, { ref: editorRef, field: field, record: record, ...props })),
                };
            }
            case FieldType.MultipleSelect:
            case FieldType.SingleSelect: {
                const data = cellValue ? (Array.isArray(cellValue) ? cellValue : [cellValue]) : [];
                return {
                    ...baseCellProps,
                    type: CellType.Select,
                    data,
                    displayData: data,
                    choiceSorted: field.options.choices,
                    choiceMap: field.displayChoiceMap,
                    isMultiple,
                    editorWidth: 220,
                    isEditingOnClick: true,
                    customEditor: (props, editorRef) => (_jsx(GridSelectEditor, { ref: editorRef, field: field, record: record, ...props })),
                };
            }
            case FieldType.Link: {
                const cv = cellValue ? (Array.isArray(cellValue) ? cellValue : [cellValue]) : [];
                const displayData = cv.map(({ title }) => title || t('common.untitled'));
                const choices = cv.map(({ id, title }) => ({ id, name: title }));
                const { foreignTableId } = field.options;
                return {
                    ...baseCellProps,
                    type: CellType.Select,
                    data: cv,
                    displayData,
                    choiceSorted: choices,
                    isMultiple,
                    onPreview: (activeId) => {
                        expandRecord?.(foreignTableId, activeId);
                    },
                    customEditor: (props) => _jsx(GridLinkEditor, { field: field, record: record, ...props }),
                };
            }
            case FieldType.Attachment: {
                const cv = (cellValue ?? []);
                const data = cv.map(({ id, mimetype, presignedUrl, smThumbnailUrl, lgThumbnailUrl }) => {
                    const url = getFileCover(mimetype, presignedUrl);
                    const thumbnailUrl = !rowHeight || rowHeight === RowHeightLevel.Short
                        ? smThumbnailUrl
                        : lgThumbnailUrl;
                    return {
                        id,
                        url: isSystemFileIcon(mimetype) ? url : thumbnailUrl ?? url,
                    };
                });
                const displayData = data.map(({ url }) => url);
                return {
                    ...baseCellProps,
                    type: CellType.Image,
                    data,
                    displayData,
                    onPreview: (activeId) => {
                        expandPreviewModal({
                            activeId,
                            field,
                            record,
                            i18nMap,
                        });
                    },
                    customEditor: (props) => (_jsx(GridAttachmentEditor, { field: field, record: record, ...props })),
                };
            }
            case FieldType.Checkbox: {
                return {
                    ...baseCellProps,
                    type: CellType.Boolean,
                    data: cellValue || false,
                    isMultiple,
                };
            }
            case FieldType.Rating: {
                const { icon, color, max } = field.options;
                if (isMultiple) {
                    return {
                        ...baseCellProps,
                        type: CellType.Number,
                        data: cellValue,
                        displayData: field.cellValue2String(cellValue),
                    };
                }
                return {
                    ...baseCellProps,
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
                    ...baseCellProps,
                    type: CellType.User,
                    data: data,
                    editorWidth: 280,
                    customEditor: (props, editorRef) => (_jsx(GridUserEditor, { ref: editorRef, field: field, record: record, ...props })),
                };
            }
            case FieldType.Button: {
                return {
                    ...baseCellProps,
                    readonly: 
                    // readonly ||
                    !checkButtonClickable(field.options, cellValue),
                    type: CellType.Button,
                    data: {
                        tableId: field.tableId,
                        cellValue: cellValue,
                        fieldOptions: field.options,
                        statusHook: buttonClickStatusHook,
                    },
                };
            }
            default: {
                return { type: CellType.Loading };
            }
        }
    }, [i18nMap, recordEditable, rowHeight, t]);
};
export function useGridColumns(hasMenu, hiddenFieldIds) {
    const view = useView();
    const originFields = useFields();
    const totalFields = useFields({ withHidden: true, withDenied: true });
    const { resolvedTheme } = useTheme();
    const sort = view?.sort;
    const group = view?.group;
    const filter = view?.filter;
    const isAutoSort = sort && !sort?.manualSort;
    const permission = useTablePermission();
    const { displayFieldIds, building } = useBuildBaseAgentStore();
    const fields = useMemo(() => {
        const hiddenSet = new Set(hiddenFieldIds ?? []);
        return originFields.filter((field) => !hiddenSet.has(field.id));
    }, [originFields, hiddenFieldIds]);
    const sortFieldIds = useMemo(() => {
        if (!isAutoSort)
            return;
        return sort.sortObjs.reduce((prev, item) => {
            prev.add(item.fieldId);
            return prev;
        }, new Set());
    }, [sort, isAutoSort]);
    const groupFieldIds = useMemo(() => {
        if (!group?.length)
            return;
        return group.reduce((prev, item) => {
            prev.add(item.fieldId);
            return prev;
        }, new Set());
    }, [group]);
    const filterFieldIds = useMemo(() => {
        if (filter == null)
            return;
        return getFilterFieldIds(filter?.filterSet, keyBy(totalFields, 'id'));
    }, [filter, totalFields]);
    const createCellValue2GridDisplay = useCreateCellValue2GridDisplay(view?.options?.rowHeight, permission['record|update']);
    const generateColumns = useGenerateColumns();
    return useMemo(() => ({
        columns: generateColumns({
            fields,
            view,
            theme: resolvedTheme,
            hasMenu,
            sortFieldIds,
            groupFieldIds,
            filterFieldIds,
        }).filter((column) => {
            if (building) {
                return displayFieldIds.includes(column.id);
            }
            return true;
        }),
        cellValue2GridDisplay: createCellValue2GridDisplay(fields),
    }), [
        generateColumns,
        fields,
        view,
        resolvedTheme,
        hasMenu,
        sortFieldIds,
        groupFieldIds,
        filterFieldIds,
        createCellValue2GridDisplay,
        building,
        displayFieldIds,
    ]);
}
