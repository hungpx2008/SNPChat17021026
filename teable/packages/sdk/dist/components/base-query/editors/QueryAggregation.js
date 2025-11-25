import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CellValueType, FieldType, getValidStatisticFunc } from '@teable/core';
import { X } from '@teable/icons';
import { BaseQueryColumnType } from '@teable/openapi';
import { Button, cn, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Separator, Error, } from '@teable/ui-lib';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from '../../../context/app/i18n';
import { useStatisticFunc2NameMap } from '../../grid-enhancements';
import { ContextColumnSelector } from '../common/ContextColumnSelector';
import { NewPopover } from '../common/NewPopover';
import { useAllColumns } from '../common/useAllColumns';
import { QueryEditorContext } from '../context/QueryEditorContext';
import { QueryFormContext } from '../context/QueryFormContext';
export const QueryAggregation = (props) => {
    const { value, onChange } = props;
    const { registerValidator } = useContext(QueryFormContext);
    const [error, setError] = useState({});
    const columns = useAllColumns();
    const { t } = useTranslation();
    const validator = useCallback(() => {
        setError({});
        if (!value) {
            return true;
        }
        const columnsIds = columns.map((c) => c.column);
        const excludeValue = value.filter((v) => !columnsIds.includes(v.column));
        if (excludeValue.length) {
            setError(excludeValue.reduce((acc, v) => ({ ...acc, [v.column]: true }), {}));
        }
        return excludeValue.length === 0;
    }, [columns, value, setError]);
    useEffect(() => {
        registerValidator('aggregation', validator);
        return () => {
            registerValidator('aggregation', undefined);
        };
    }, [registerValidator, validator]);
    return (_jsxs("div", { className: "flex flex-1 flex-col gap-2", children: [value?.map((aggregation, index) => (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(ContextColumnSelector, { value: aggregation.column, onChange: (column, type) => {
                                            const newAggregation = [...value];
                                            newAggregation[index] = {
                                                ...aggregation,
                                                type,
                                                column,
                                            };
                                            onChange(newAggregation);
                                        } }), _jsx(Separator, { className: "w-2" }), _jsx(AggregationStaticSelector, { value: aggregation.statisticFunc, columnId: aggregation.column, onChange: (statisticFunc) => {
                                            const newAggregation = [...value];
                                            newAggregation[index] = {
                                                ...aggregation,
                                                statisticFunc,
                                            };
                                            onChange(newAggregation);
                                        } })] }), _jsx(Button, { className: "h-7 text-[13px]", variant: 'link', onClick: () => {
                                    const newValue = [...value];
                                    newValue.splice(index, 1);
                                    onChange(newValue);
                                }, children: _jsx(X, {}) })] }), _jsx(Error, { error: error[aggregation.column] ? t('baseQuery.error.invalidCol') : undefined })] }, index))), _jsx("div", { children: _jsx(NewAggregation, { onSubmit: (col) => onChange([...(value ?? []), col]) }) })] }));
};
const NewAggregation = (props) => {
    const { onSubmit } = props;
    const [column, setColumn] = useState();
    const [statisticFunc, setStatisticFunc] = useState();
    const [type, setType] = useState();
    const onAdd = () => {
        if (column && statisticFunc && type) {
            onSubmit({ column, statisticFunc, type });
            setColumn(undefined);
            setStatisticFunc(undefined);
            setType(undefined);
        }
    };
    return (_jsxs(NewPopover, { addButton: {
            disabled: !column || !statisticFunc || !type,
        }, onSubmit: onAdd, children: [_jsx(ContextColumnSelector, { className: "flex-1", value: column, onChange: (column, type) => {
                    setType(type);
                    setColumn(column);
                } }), _jsx(Separator, { className: "w-2" }), _jsx(AggregationStaticSelector, { className: "flex-1", value: statisticFunc, columnId: column, onChange: (statisticFunc) => {
                    setStatisticFunc(statisticFunc);
                } })] }));
};
const AggregationStaticSelector = (props) => {
    const { className, value, columnId, onChange } = props;
    const statisticFunc2NameMap = useStatisticFunc2NameMap();
    const { columns } = useContext(QueryEditorContext);
    const { t } = useTranslation();
    const column = columnId
        ? [...columns.from, ...columns.join].find((c) => c.column === columnId)
        : undefined;
    const menuItems = column
        ? getValidStatisticFunc(column.type === BaseQueryColumnType.Field
            ? column.fieldSource
            : {
                type: FieldType.Number,
                cellValueType: CellValueType.Number,
            })
        : [];
    return (_jsxs(Select, { value: value, onValueChange: onChange, children: [_jsx(SelectTrigger, { disabled: !column, className: cn('h-7 w-auto min-w-20 text-[13px]', className), children: _jsx(SelectValue, { placeholder: t('common.selectPlaceHolder') }) }), _jsx(SelectContent, { children: menuItems.map((type) => (_jsx(SelectItem, { value: type, children: statisticFunc2NameMap[type] }, type))) })] }));
};
