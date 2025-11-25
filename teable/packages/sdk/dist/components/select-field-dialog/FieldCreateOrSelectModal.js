import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFieldRoSchema, FieldType } from '@teable/core';
import { ArrowLeft } from '@teable/icons';
import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Label, RadioGroup, RadioGroupItem, ScrollArea, cn, } from '@teable/ui-lib';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from '../../context/app/i18n';
import { useFieldOperations, useFieldStaticGetter, useFields, useTableId } from '../../hooks';
import { FieldCreator } from './FieldCreator';
export const FieldCreateOrSelectModal = forwardRef((props, forwardRef) => {
    const { title, description, content, selectedFieldId: _selectedFieldId, children, onConfirm, } = props;
    const tableId = useTableId();
    const totalFields = useFields({ withHidden: true, withDenied: true });
    const { createField } = useFieldOperations();
    const getFieldStatic = useFieldStaticGetter();
    const [newField, setNewField] = useState();
    const { t } = useTranslation();
    const [selectedFieldId, setSelectedFieldId] = useState(_selectedFieldId);
    const [open, setOpen] = useState(false);
    useImperativeHandle(forwardRef, () => ({
        onOpen: () => setOpen(true),
        onClose: () => setOpen(false),
    }));
    useEffect(() => {
        setSelectedFieldId(_selectedFieldId);
    }, [_selectedFieldId]);
    const onFieldSelect = (value) => {
        setSelectedFieldId(value);
    };
    const onConfirmInner = async () => {
        if (newField != null) {
            if (tableId == null)
                return setNewField(undefined);
            const result = createFieldRoSchema.safeParse(newField);
            if (result.success) {
                const field = await createField({ tableId, fieldRo: newField });
                setNewField(undefined);
                return onConfirm?.(field);
            }
            return setNewField(undefined);
        }
        if (selectedFieldId != null) {
            const selectedField = totalFields.find((field) => field.id === selectedFieldId);
            return selectedField ? onConfirm?.(selectedField) : undefined;
        }
    };
    const filteredFields = useMemo(() => {
        return totalFields.filter((field) => {
            const { type } = field;
            if (type === FieldType.Attachment || type === FieldType.Button) {
                return false;
            }
            return true;
        });
    }, [totalFields]);
    return (_jsxs(Dialog, { open: open, onOpenChange: setOpen, children: [_jsx(DialogTrigger, { asChild: true, children: children(open) }), _jsxs(DialogContent, { className: "p-5", closeable: false, onInteractOutside: (e) => e.preventDefault(), onEscapeKeyDown: (e) => e.preventDefault(), children: [_jsxs(DialogHeader, { className: "space-y-2", children: [_jsx(DialogTitle, { children: title }), description && _jsx(DialogDescription, { className: "text-xs", children: description })] }), _jsx("div", { className: "rounded-md bg-gray-50 p-3 pr-0 dark:bg-gray-900", children: _jsx(ScrollArea, { className: "h-52 w-full", type: "always", children: newField ? (_jsx(FieldCreator, { field: newField, setField: setNewField })) : (_jsx(RadioGroup, { className: "gap-4", value: selectedFieldId, onValueChange: onFieldSelect, children: filteredFields.map((field) => {
                                    const { id, type, name, isLookup, aiConfig, canReadFieldRecord } = field;
                                    const { Icon } = getFieldStatic(type, {
                                        isLookup,
                                        isConditionalLookup: field.isConditionalLookup,
                                        hasAiConfig: Boolean(aiConfig),
                                        deniedReadRecord: !canReadFieldRecord,
                                    });
                                    return (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(RadioGroupItem, { value: id, id: id }), _jsxs(Label, { className: "flex cursor-pointer items-center space-x-1", htmlFor: id, children: [_jsx(Icon, { className: "size-4" }), _jsx("span", { children: name })] })] }, id));
                                }) })) }) }), content, _jsxs(DialogFooter, { className: cn(newField && 'justify-between sm:justify-between'), children: [newField && (_jsxs(Button, { variant: 'ghost', onClick: () => setNewField(undefined), children: [_jsx(ArrowLeft, {}), t('common.back')] })), _jsx(DialogClose, { asChild: true, children: _jsx(Button, { disabled: !selectedFieldId && !newField, onClick: onConfirmInner, children: t('common.done') }) })] })] })] }));
});
FieldCreateOrSelectModal.displayName = 'FieldCreateOrSelectModal';
