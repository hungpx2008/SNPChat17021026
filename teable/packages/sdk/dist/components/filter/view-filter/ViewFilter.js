import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FieldType } from '@teable/core';
import { Popover, PopoverTrigger, PopoverContent, cn } from '@teable/ui-lib';
import { isEqual } from 'lodash';
import { useState } from 'react';
import { useDebounce, useLatest, useUpdateEffect } from 'react-use';
import { useTranslation } from '../../../context/app/i18n';
import { useFields, useTableId, useViewId, useTablePermission } from '../../../hooks';
import { ReadOnlyTip } from '../../ReadOnlyTip';
import { BaseViewFilter } from './BaseViewFilter';
import { useFilterNode, useViewFilterLinkContext } from './hooks';
export const ViewFilter = (props) => {
    const { contentHeader, filters, children, onChange } = props;
    const { t } = useTranslation();
    const title = t('filter.tips.scope');
    const emptyText = t('filter.default.empty');
    const defaultFields = useFields({ withHidden: true, withDenied: true });
    const fields = defaultFields.filter((f) => f.type !== FieldType.Button);
    const { text, isActive } = useFilterNode(filters, fields);
    const latestValue = useLatest(filters);
    const [filter, setFilter] = useState(latestValue.current);
    useUpdateEffect(() => {
        if (!isEqual(latestValue.current, filter)) {
            setFilter(latestValue.current);
        }
    }, [latestValue.current]);
    const viewId = useViewId();
    const tableId = useTableId();
    const permission = useTablePermission();
    const viewFilterLinkContext = useViewFilterLinkContext(tableId, viewId, {
        disabled: !permission['view|update'],
    });
    const finalViewFilterLinkContext = props.viewFilterLinkContext || viewFilterLinkContext;
    const onChangeHandler = (value) => {
        setFilter(value);
    };
    useDebounce(() => {
        if (!isEqual(filter, latestValue.current)) {
            onChange(filter);
        }
    }, 300, [filter]);
    return (_jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: children?.(text, isActive) }), _jsxs(PopoverContent, { side: "bottom", align: "start", className: cn('flex max-h-96 w-min min-w-[544px] max-w-screen-md flex-col overflow-hidden p-0 relative'), children: [_jsx(ReadOnlyTip, {}), contentHeader, _jsx("div", { className: "px-2 py-1 text-xs", children: filters?.filterSet?.length ? (_jsx("div", { className: "pt-2", children: title })) : (_jsx("div", { className: "pt-2 text-muted-foreground", children: emptyText })) }), _jsx(BaseViewFilter, { fields: fields, value: filter, onChange: onChangeHandler, customValueComponent: props.customValueComponent, viewFilterLinkContext: finalViewFilterLinkContext })] })] }));
};
