import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from '@teable/icons';
import { BaseQueryColumnType, getFields } from '@teable/openapi';
import { Button, cn } from '@teable/ui-lib';
import { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState, } from 'react';
import { QuerySortedKeys } from './constant';
import { QueryEditorProvider } from './context/QueryEditorProvider';
import { QueryFormContext } from './context/QueryFormContext';
import { QueryFormProvider } from './context/QueryFormProvider';
import { QueryFrom } from './query-from/QueryFrom';
import { QueryFromTableValue } from './query-from/QueryFromValue';
import { QueryEditorContainer } from './QueryEditorContainer';
import { QueryOperators } from './QueryOperators';
export const BaseQueryBuilder = forwardRef((props, ref) => {
    return (_jsx(QueryFormProvider, { children: _jsx(QueryBuilderContainer, { ...props, ref: ref }) }));
});
BaseQueryBuilder.displayName = 'QueryBuilder';
// TODO: Refactor this component context generation
const QueryBuilderContainer = forwardRef((props, ref) => {
    const { className, query, onChange, depth = 0, getContextFromChild, maxDepth = 3 } = props;
    const [fromType, setFromType] = useState();
    const [childContext, setChildContext] = useState([]);
    const [joinContext, setJoinContext] = useState([]);
    const [aggregationContext, setAggregationContext] = useState([]);
    const [canSelectedColumnIds, setCanSelectedColumnIds] = useState();
    const formQueryRef = useRef(null);
    const { validators } = useContext(QueryFormContext);
    useEffect(() => {
        if (query) {
            if (query.from == undefined) {
                setFromType(undefined);
                return;
            }
            setFromType(typeof query.from === 'string' && fromType !== 'query' && query.from ? 'table' : 'query');
        }
        else {
            setFromType(undefined);
        }
    }, [query, fromType]);
    useImperativeHandle(ref, () => ({
        validateQuery: () => {
            // validate from
            // context validators
            if (formQueryRef.current && !formQueryRef.current.validateQuery()) {
                return false;
            }
            // validate all keys
            if (['from', ...QuerySortedKeys].some((key) => validators[key] && !validators[key]?.()))
                return false;
            return true;
        },
        initContext: (innerQuery) => {
            const query = innerQuery || props.query;
            collectContext('from', query?.from);
            collectContext('join', query?.join);
            collectContext('aggregation', query?.aggregation);
            formQueryRef.current?.initContext(query?.from);
        },
    }));
    const hasAggregation = !!query?.aggregation?.length;
    useEffect(() => {
        if (hasAggregation) {
            setCanSelectedColumnIds(query?.groupBy?.map((group) => group.column) || []);
        }
        else {
            setCanSelectedColumnIds(undefined);
        }
    }, [hasAggregation, query?.groupBy]);
    useEffect(() => {
        if (childContext.length === 0) {
            return getContextFromChild?.([]);
        }
        const aggregationColumns = aggregationContext.map((aggregation) => ({
            column: aggregation.column,
            type: BaseQueryColumnType.Aggregation,
            name: aggregation.name,
        }));
        const allColumns = canSelectedColumnIds
            ? [
                ...childContext.filter(({ column }) => canSelectedColumnIds.includes(column)),
                ...aggregationColumns,
                ...joinContext.filter(({ column }) => canSelectedColumnIds.includes(column)),
            ]
            : [...childContext, ...aggregationColumns, ...joinContext];
        if (!query?.select) {
            return getContextFromChild?.(allColumns);
        }
        const selectCols = query?.select;
        getContextFromChild?.(aggregationColumns.concat(selectCols
            .map((selectCol) => allColumns.find((v) => v.column === selectCol.column))
            .filter(Boolean)));
    }, [
        aggregationContext,
        childContext,
        getContextFromChild,
        joinContext,
        query?.select,
        canSelectedColumnIds,
    ]);
    const getContextWithTableIds = async (tableIds) => {
        const tableFields = await Promise.all(tableIds.map((tableId) => getFields(tableId).then((res) => res.data)));
        return tableFields.map((fields) => fields.map((field) => ({
            column: field.id,
            type: BaseQueryColumnType.Field,
            name: field.name,
            fieldSource: field,
        })));
    };
    const collectContext = async (key, value) => {
        switch (key) {
            case 'join':
                {
                    if (!value) {
                        return setJoinContext([]);
                    }
                    const join = value;
                    const tableIds = join.map((v) => v.table).filter((v) => !!v);
                    const tablesContext = await getContextWithTableIds(tableIds);
                    setJoinContext(tablesContext
                        .map((context, i) => context.map((v) => ({
                        ...v,
                        groupTableId: tableIds[i],
                    })))
                        .flat());
                }
                break;
            case 'aggregation':
                {
                    if (!value) {
                        return setAggregationContext([]);
                    }
                    const aggregations = value;
                    setAggregationContext(aggregations
                        .map((aggregation) => {
                        const column = [...joinContext, ...childContext].find((v) => v.column === aggregation.column);
                        if (!column)
                            return;
                        return {
                            name: `${column.name}_${aggregation.statisticFunc}`,
                            type: column.type,
                            column: `${aggregation.column}_${aggregation.statisticFunc}`,
                            fieldSource: column.fieldSource,
                        };
                    })
                        .filter(Boolean));
                }
                break;
            case 'from':
                {
                    if (!value) {
                        setChildContext([]);
                        return;
                    }
                    if (typeof value === 'string') {
                        const context = await getContextWithTableIds([value]);
                        setChildContext(context.flat());
                    }
                }
                break;
        }
    };
    const onQueryChange = async (key, value) => {
        console.log(depth, 'onQueryChange', key, value);
        collectContext(key, value);
        if (!query) {
            key === 'from' &&
                onChange({
                    from: value,
                });
            return;
        }
        onChange({
            ...query,
            [key]: value,
        });
    };
    const handleGetContextFromChild = useCallback((childContext) => {
        setChildContext(childContext);
    }, []);
    const providerContextColumns = useMemo(() => {
        return {
            from: childContext,
            join: joinContext,
        };
    }, [childContext, joinContext]);
    const onFromChange = async (type, tableId) => {
        console.log(depth, 'onFromChange', type, tableId);
        if (type === 'query') {
            onQueryChange('from', '');
            setFromType('query');
            return;
        }
        if (tableId) {
            onQueryChange('from', tableId);
            setFromType('table');
            return;
        }
        // if tableId is undefined, clear from
        if (!tableId) {
            setFromType(undefined);
            onChange(undefined);
            return;
        }
        setFromType(undefined);
        onQueryChange('from', '');
    };
    const onFromQueryChange = (query) => {
        if (!query) {
            setChildContext([]);
            setFromType(undefined);
            // if tableId is undefined, clear from
            onChange(undefined);
            return;
        }
        onQueryChange('from', query ?? '');
    };
    return (_jsxs("div", { className: cn('relative rounded border py-4 px-2', className), children: [depth > 0 && (_jsx(Button, { className: "absolute right-1 top-1 h-auto rounded-full p-0.5 text-[13px]", size: 'xs', variant: 'outline', onClick: () => onChange(undefined), children: _jsx(X, {}) })), _jsx(QueryFrom, { addButton: !fromType, maxDepth: maxDepth <= depth + 1, onClick: onFromChange, children: _jsx(QueryFromTableValue, { from: query?.from, onChange: (from) => onFromChange('from', from), component: fromType === 'query' ? (_jsx(QueryFormProvider, { children: _jsx(QueryBuilderContainer, { ref: formQueryRef, className: "py-6", query: query?.from, onChange: onFromQueryChange, depth: depth + 1, maxDepth: maxDepth, getContextFromChild: handleGetContextFromChild }) })) : undefined }) }), query?.from && (_jsxs(QueryEditorProvider, { columns: providerContextColumns, canSelectedColumnIds: canSelectedColumnIds, defaultStatus: {
                    join: !!query?.join,
                    limit: !!query?.limit,
                    where: !!query?.where,
                    offset: !!query?.offset,
                    select: !!query?.select,
                    groupBy: !!query?.groupBy,
                    orderBy: !!query?.orderBy,
                    aggregation: !!query?.aggregation,
                }, children: [_jsx(QueryOperators, {}), _jsx(QueryEditorContainer, { query: query, onChange: onQueryChange })] }))] }));
});
QueryBuilderContainer.displayName = 'QueryBuilderContainer';
