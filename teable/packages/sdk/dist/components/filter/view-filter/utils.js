import { CellValueType, FieldType } from '@teable/core';
import { EMPTY_OPERATORS, ARRAY_OPERATORS } from './constant';
import { isFilterItem } from './type-guard';
export const viewFilter2BaseFilter = (viewFilter) => {
    if (!viewFilter) {
        return {
            conjunction: 'and',
            children: [],
        };
    }
    const transform = (filter) => {
        if ('filterSet' in filter) {
            return {
                conjunction: filter.conjunction,
                children: filter.filterSet.map(transform),
            };
        }
        else {
            return {
                field: filter.fieldId,
                operator: filter.operator,
                value: filter.value,
            };
        }
    };
    return transform(viewFilter);
};
export const baseFilter2ViewFilter = (baseFilter) => {
    if (baseFilter?.children?.length === 0) {
        return null;
    }
    const transform = (filter) => {
        if ('children' in filter) {
            return {
                conjunction: filter.conjunction,
                filterSet: filter.children.map(transform),
            };
        }
        else {
            return {
                fieldId: filter.field,
                operator: filter.operator,
                value: filter.value,
            };
        }
    };
    return transform(baseFilter);
};
/**
 * 1. when the operator type change to empty, the value should be null
 * 2. when the operator type change and the cellValueType changed, the value should be null
 */
export const shouldResetFieldValue = (newOperator, oldOperator) => {
    const getOperatorType = (operator) => {
        if (EMPTY_OPERATORS.includes(operator)) {
            return 'empty';
        }
        if (ARRAY_OPERATORS.includes(operator)) {
            return 'multiple';
        }
        return 'common';
    };
    const newOperatorType = getOperatorType(newOperator);
    const oldOperatorType = getOperatorType(oldOperator);
    // date type exchange from `isWithIn` or to `isWithIn` should reset value
    if ((newOperator === 'isWithIn' || oldOperator === 'isWithIn') && newOperator !== oldOperator) {
        return true;
    }
    if (newOperatorType === oldOperatorType) {
        return false;
    }
    return true;
};
export const shouldFilterByDefaultValue = (field) => {
    if (!field)
        return false;
    const { type, cellValueType } = field;
    return (type === FieldType.Checkbox ||
        ((type === FieldType.Formula || type === FieldType.ConditionalRollup) &&
            cellValueType === CellValueType.Boolean));
};
export const getFilterFieldIds = (filter, fieldMap) => {
    const filterIds = new Set();
    filter.forEach((item) => {
        if (isFilterItem(item)) {
            // The checkbox field and the formula field, when the cellValueType is Boolean, have a default value of null, but they can still work
            const field = fieldMap[item.fieldId];
            if (item.value === 0 ||
                item.value ||
                EMPTY_OPERATORS.includes(item.operator) ||
                shouldFilterByDefaultValue(field)) {
                filterIds.add(item.fieldId);
            }
        }
        else {
            const childFilterIds = getFilterFieldIds(item.filterSet, fieldMap);
            childFilterIds.forEach((id) => filterIds.add(id));
        }
    });
    return filterIds;
};
