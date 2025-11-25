import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { isMultiValueLink } from '@teable/core';
import { Plus } from '@teable/icons';
import { Button, Dialog, DialogContent, DialogTrigger, useToast } from '@teable/ui-lib';
import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { LinkViewProvider, RowCountProvider } from '../../../context';
import { useTranslation } from '../../../context/app/i18n';
import { LinkFilterProvider } from '../../../context/query/LinkFilterProvider';
import { ExpandRecorder } from '../../expand-record';
import { LinkEditorMain } from './EditorMain';
import { LinkListType } from './interface';
import { LinkCard } from './LinkCard';
import { LinkList } from './LinkList';
export var LinkDisplayType;
(function (LinkDisplayType) {
    LinkDisplayType["Grid"] = "grid";
    LinkDisplayType["List"] = "list";
})(LinkDisplayType || (LinkDisplayType = {}));
export const LinkEditor = (props) => {
    const { cellValue, options, onChange, readonly, className, displayType = LinkDisplayType.Grid, } = props;
    const { toast } = useToast();
    const listRef = useRef(null);
    const linkEditorMainRef = useRef(null);
    const [isEditing, setEditing] = useState(false);
    const [values, setValues] = useState();
    const [expandRecordId, setExpandRecordId] = useState();
    const { t } = useTranslation();
    const { foreignTableId, relationship } = options;
    const isMultiple = isMultiValueLink(relationship);
    const cvArray = useMemo(() => {
        return Array.isArray(cellValue) || !cellValue ? cellValue : [cellValue];
    }, [cellValue]);
    const recordIds = cvArray?.map((cv) => cv.id);
    const selectedRowCount = recordIds?.length ?? 0;
    const isEqualPrevValue = useMemo(() => {
        return JSON.stringify(values) === JSON.stringify(cellValue);
    }, [cellValue, values]);
    const selectedRecordIds = useMemo(() => {
        return Array.isArray(cellValue)
            ? cellValue.map((v) => v.id)
            : cellValue?.id
                ? [cellValue.id]
                : [];
    }, [cellValue]);
    const recordQuery = useMemo(() => {
        return {
            selectedRecordIds,
        };
    }, [selectedRecordIds]);
    useEffect(() => {
        if (cellValue == null)
            return setValues(cellValue);
        setValues(Array.isArray(cellValue) ? cellValue : [cellValue]);
    }, [cellValue]);
    const updateExpandRecordId = (recordId) => {
        if (recordId) {
            const existed = document.getElementById(`${foreignTableId}-${recordId}`);
            if (existed) {
                toast({ description: t('editor.link.alreadyOpen') });
                return;
            }
        }
        setExpandRecordId(recordId);
    };
    const onRecordExpand = (recordId) => {
        updateExpandRecordId(recordId);
    };
    const onRecordDelete = (recordId) => {
        onChange?.(isMultiple ? cellValue?.filter((cv) => cv.id !== recordId) : null);
    };
    const onRecordListChange = useCallback((value) => {
        setValues(value);
    }, []);
    const onOpenChange = (open) => {
        if (open)
            return setEditing?.(true);
        return linkEditorMainRef.current?.onReset();
    };
    const onConfirm = () => {
        if (values == null)
            return onChange?.(null);
        onChange?.(isMultiple ? values : values[0]);
    };
    return (_jsxs("div", { className: "space-y-3", children: [Boolean(selectedRowCount) &&
                (displayType === LinkDisplayType.Grid ? (_jsx("div", { className: "relative h-40 w-full overflow-hidden rounded-md border", children: _jsx(LinkViewProvider, { linkFieldId: props.fieldId, children: _jsx(LinkFilterProvider, { filterLinkCellCandidate: props.recordId ? [props.fieldId, props.recordId] : props.fieldId, selectedRecordIds: props.recordId ? undefined : selectedRecordIds, children: _jsx(RowCountProvider, { children: _jsx(LinkList, { ref: listRef, type: LinkListType.Selected, rowCount: selectedRowCount, readonly: readonly, cellValue: cellValue, isMultiple: isMultiple, recordQuery: recordQuery, onChange: onRecordListChange, onExpand: onRecordExpand }) }) }) }) })) : (cvArray?.map(({ id, title }) => (_jsx(LinkCard, { title: title, readonly: readonly, onClick: () => onRecordExpand(id), onDelete: () => onRecordDelete(id) }, id))))), !readonly && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex justify-between", children: [_jsxs(Dialog, { open: isEditing, onOpenChange: onOpenChange, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", size: 'sm', className: className, children: [_jsx(Plus, {}), t('editor.link.selectRecord')] }) }), _jsx(DialogContent, { className: "flex h-[520px] max-w-4xl flex-col", children: _jsx(LinkEditorMain, { ...props, ref: linkEditorMainRef, isEditing: isEditing, setEditing: setEditing }) })] }), Boolean(selectedRowCount) &&
                                !isEqualPrevValue &&
                                displayType === LinkDisplayType.Grid && (_jsx(Button, { size: 'sm', onClick: onConfirm, children: t('common.confirm') }))] }), _jsx(ExpandRecorder, { tableId: foreignTableId, recordId: expandRecordId, recordIds: recordIds, onUpdateRecordIdCallback: updateExpandRecordId, onClose: () => updateExpandRecordId(undefined) })] }))] }));
};
