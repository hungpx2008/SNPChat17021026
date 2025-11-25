import { assertNever, ColorConfigType, FieldType, filterSchema, getValidFilterOperators, ViewType, } from '@teable/core';
import { keyBy } from 'lodash';
// eslint-disable-next-line sonarjs/cognitive-complexity
export const validatePersonalViewProps = (view, fields) => {
    const { filter, sort, group, options, columnMeta } = view;
    const fieldMap = keyBy(fields, 'id');
    const willSyncViewData = { ...view };
    if (filter) {
        willSyncViewData.filter = validateViewFilter(filter, fieldMap);
    }
    if (sort) {
        const sortObjs = sort?.sortObjs?.filter((s) => fieldMap[s.fieldId]);
        willSyncViewData.sort = sortObjs?.length
            ? {
                ...sort,
                sortObjs,
            }
            : undefined;
    }
    if (group) {
        const filteredGroup = group?.filter((g) => fieldMap[g.fieldId]);
        willSyncViewData.group = filteredGroup?.length ? filteredGroup : undefined;
    }
    if (options) {
        willSyncViewData.options = validateViewOptions(view, fieldMap);
    }
    if (columnMeta) {
        willSyncViewData.columnMeta = Object.entries(columnMeta).reduce((acc, [fieldId, column]) => {
            if (fieldMap[fieldId]) {
                acc[fieldId] = column;
            }
            return acc;
        }, {});
    }
    return willSyncViewData;
};
export const validateFilterItem = (item, fieldMap) => {
    const { fieldId, value, operator } = item;
    const field = fieldMap[fieldId];
    if (!field)
        return null;
    const { type, options, isMultipleCellValue } = field;
    const validOperators = getValidFilterOperators(field);
    if (!validOperators.includes(operator))
        return null;
    if (value == null) {
        return item;
    }
    if (type === FieldType.SingleSelect && !isMultipleCellValue) {
        if (typeof value !== 'string')
            return null;
        const choice = options.choices.find((c) => c.name === value);
        return choice ? item : null;
    }
    if ([FieldType.MultipleSelect, FieldType.SingleSelect].includes(type) && isMultipleCellValue) {
        if (!Array.isArray(value))
            return null;
        const choices = options.choices.filter((c) => value.includes(c.name));
        return choices.length ? { ...item, value: choices.map((c) => c.name) } : null;
    }
    return item;
};
export const validateViewFilter = (filter, fieldMap) => {
    if (!filter)
        return;
    const result = filterSchema.safeParse(filter);
    if (!result.success || result.data == null)
        return;
    const validateFilter = (item) => {
        if ('fieldId' in item) {
            return validateFilterItem(item, fieldMap);
        }
        if ('filterSet' in item) {
            const validFilters = item.filterSet
                .map((subItem) => validateFilter(subItem))
                .filter((item) => item !== null);
            if (validFilters.length === 0)
                return null;
            return {
                conjunction: item.conjunction,
                filterSet: validFilters,
            };
        }
        return null;
    };
    const validatedFilter = validateFilter(result.data);
    return validatedFilter;
};
export const validateViewOptions = (view, fieldMap) => {
    const { type, options } = view;
    switch (type) {
        case ViewType.Grid:
        case ViewType.Form: {
            return options;
        }
        case ViewType.Gallery: {
            const { coverFieldId } = options;
            return {
                ...options,
                coverFieldId: validateField(coverFieldId, fieldMap, FieldType.Attachment),
            };
        }
        case ViewType.Kanban: {
            const { stackFieldId, coverFieldId } = options;
            return {
                ...options,
                stackFieldId: validateField(stackFieldId, fieldMap),
                coverFieldId: validateField(coverFieldId, fieldMap, FieldType.Attachment),
            };
        }
        case ViewType.Calendar: {
            const { startDateFieldId, endDateFieldId, titleFieldId, colorConfig } = options;
            const isColorByField = colorConfig?.type === ColorConfigType.Field;
            const colorFieldId = isColorByField ? colorConfig?.fieldId : null;
            const colorField = colorFieldId ? fieldMap[colorFieldId] : null;
            return {
                ...options,
                startDateFieldId: validateField(startDateFieldId, fieldMap, FieldType.Date),
                endDateFieldId: validateField(endDateFieldId, fieldMap, FieldType.Date),
                titleFieldId: validateField(titleFieldId, fieldMap),
                colorConfig: isColorByField
                    ? colorFieldId && colorField && colorField.type === FieldType.SingleSelect
                        ? {
                            ...colorConfig,
                            fieldId: colorFieldId,
                        }
                        : undefined
                    : colorConfig,
            };
        }
        default: {
            assertNever(type);
        }
    }
};
const validateField = (fieldId, fieldMap, expectedType) => {
    if (!fieldId)
        return;
    const field = fieldMap[fieldId];
    if (!field)
        return;
    if (expectedType && field.type !== expectedType)
        return;
    return fieldId;
};
export const generatePersonalViewProps = (view) => {
    if (!view || view.type === ViewType.Plugin || view.type === ViewType.Form)
        return {};
    const { id, type, filter, sort, group, options, columnMeta } = view;
    return {
        id,
        type,
        filter,
        sort,
        group,
        options,
        columnMeta,
    };
};
