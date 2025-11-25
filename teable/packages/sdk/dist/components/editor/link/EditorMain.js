import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { isMultiValueLink } from '@teable/core';
import { ArrowUpRight, Plus } from '@teable/icons';
import { Button, Tabs, TabsList, TabsTrigger } from '@teable/ui-lib';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, } from 'react';
import { RowCountProvider, LinkViewProvider } from '../../../context';
import { useTranslation } from '../../../context/app/i18n';
import { LinkFilterProvider } from '../../../context/query/LinkFilterProvider';
import { useBaseId, useLinkFilter, useRowCount, useSearch } from '../../../hooks';
import { CreateRecordModal } from '../../create-record';
import { SearchInput } from '../../search';
import { LinkListType } from './interface';
import { LinkList } from './LinkList';
const LinkEditorInnerBase = (props, forwardRef) => {
    const { recordId, fieldId, options, cellValue, isEditing, setEditing, onChange, onExpand } = props;
    const { searchQuery } = useSearch();
    const rowCount = useRowCount() || 0;
    const baseId = useBaseId();
    useImperativeHandle(forwardRef, () => ({
        onReset,
    }));
    const { t } = useTranslation();
    const listRef = useRef(null);
    const [values, setValues] = useState();
    const isMultiple = isMultiValueLink(options.relationship);
    const { foreignTableId, filterByViewId } = options;
    const { listType, setListType, selectedRecordIds, filterLinkCellCandidate, filterLinkCellSelected, setLinkCellCandidate, setLinkCellSelected, } = useLinkFilter();
    const recordQuery = useMemo(() => {
        return {
            search: searchQuery,
            // for new record
            selectedRecordIds: recordId ? undefined : selectedRecordIds,
            filterLinkCellSelected,
            filterLinkCellCandidate,
        };
    }, [searchQuery, filterLinkCellCandidate, filterLinkCellSelected, selectedRecordIds, recordId]);
    useEffect(() => {
        if (!isEditing)
            return;
        listRef.current?.onForceUpdate();
        if (cellValue == null)
            return setValues(cellValue);
        setValues(Array.isArray(cellValue) ? cellValue : [cellValue]);
    }, [cellValue, isEditing]);
    const onViewShown = (type) => {
        if (type === listType)
            return;
        listRef.current?.onReset();
        setListType(type);
        if (type === LinkListType.Selected) {
            setLinkCellSelected([fieldId, recordId].filter(Boolean));
        }
        else {
            setLinkCellCandidate([fieldId, recordId].filter(Boolean));
        }
    };
    const onReset = () => {
        setValues(undefined);
        setEditing?.(false);
        setListType(LinkListType.Unselected);
        listRef.current?.onReset();
    };
    const onListChange = useCallback((value) => {
        setValues(value);
    }, []);
    const onConfirm = () => {
        onReset();
        if (values == null)
            return onChange?.(null);
        onChange?.(isMultiple ? values : values[0]);
    };
    const onNavigate = () => {
        if (!baseId)
            return;
        let path = `/base/${baseId}/${foreignTableId}`;
        if (filterByViewId) {
            path += `/${filterByViewId}`;
        }
        const url = new URL(path, window.location.origin);
        window.open(url.toString(), '_blank');
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center space-x-0.5", children: [_jsx("span", { className: "text-lg", children: t('editor.link.placeholder') }), _jsxs(Button, { size: "xs", variant: "link", className: "gap-0.5 text-[13px] text-slate-500 underline", onClick: onNavigate, children: [t('editor.link.goToForeignTable'), _jsx(ArrowUpRight, { className: "size-4" })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(SearchInput, { container: props.container }), _jsx("div", { className: "ml-4", children: _jsx(Tabs, { defaultValue: "unselected", orientation: "horizontal", className: "flex gap-4", children: _jsxs(TabsList, { className: "", children: [_jsx(TabsTrigger, { className: "px-4", value: "unselected", onClick: () => onViewShown(LinkListType.Unselected), children: t('editor.link.unselected') }), _jsx(TabsTrigger, { className: "px-4", value: "selected", onClick: () => onViewShown(LinkListType.Selected), children: t('editor.link.selected') })] }) }) })] }), _jsx("div", { className: "relative w-full flex-1 overflow-hidden rounded-md border", children: _jsx(LinkList, { ref: listRef, type: listType, rowCount: rowCount, cellValue: cellValue, isMultiple: isMultiple, recordQuery: recordQuery, onChange: onListChange, onExpand: onExpand }) }), _jsxs("div", { className: "flex justify-between", children: [_jsx(CreateRecordModal, { children: _jsxs(Button, { variant: "ghost", children: [_jsx(Plus, { className: "size-4" }), t('editor.link.create')] }) }), _jsxs("div", { children: [_jsx(Button, { variant: "outline", onClick: onReset, children: t('common.cancel') }), _jsx(Button, { className: "ml-4", onClick: onConfirm, children: t('common.confirm') })] })] })] }));
};
const LinkEditorInner = forwardRef(LinkEditorInnerBase);
const LinkEditorMainBase = (props, forwardRef) => {
    const { options, cellValue } = props;
    const { baseId: foreignBaseId } = options;
    const baseId = useBaseId();
    const selectedRecordIds = useMemo(() => {
        return Array.isArray(cellValue)
            ? cellValue.map((v) => v.id)
            : cellValue?.id
                ? [cellValue.id]
                : [];
    }, [cellValue]);
    return (_jsx(LinkViewProvider, { linkBaseId: foreignBaseId ?? baseId, linkFieldId: props.fieldId, children: _jsx(LinkFilterProvider, { filterLinkCellCandidate: props.recordId ? [props.fieldId, props.recordId] : props.fieldId, selectedRecordIds: props.recordId ? undefined : selectedRecordIds, children: _jsx(RowCountProvider, { children: _jsx(LinkEditorInner, { ref: forwardRef, ...props }) }) }) }));
};
export const LinkEditorMain = forwardRef(LinkEditorMainBase);
