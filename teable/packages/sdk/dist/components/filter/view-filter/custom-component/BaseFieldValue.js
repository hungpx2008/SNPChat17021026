import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { assertNever, CellValueType, FieldType, isFieldReferenceValue, isFieldReferenceOperatorSupported, isFieldReferenceComparable, exactDate, exactFormatDate, } from '@teable/core';
import { Switch } from '@teable/icons';
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, cn, } from '@teable/ui-lib';
import { cloneElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from '../../../../context/app/i18n';
import { NumberEditor, RatingEditor } from '../../../editor';
import { FieldSelector } from '../../../field';
import { FileTypeSelect, FilterCheckbox, FilterDatePicker, FilterInput, FilterLink, FilterMultipleSelect, FilterSingleSelect, FilterUserSelect, } from '../component';
import { EMPTY_OPERATORS, ARRAY_OPERATORS } from '../constant';
const ConditionalRollupValue = (props) => {
    const { literalComponent, value, onSelect, operator, referenceSource, modal, field } = props;
    const { t } = useTranslation();
    const referenceFields = referenceSource?.fields ?? [];
    const referenceTableId = referenceSource?.tableId ?? referenceFields[0]?.tableId;
    const isFieldMode = isFieldReferenceValue(value);
    const [lastLiteralValue, setLastLiteralValue] = useState(isFieldMode ? null : value);
    const [literalModeHint, setLiteralModeHint] = useState(null);
    const handleLiteralModeChange = useCallback((mode) => {
        setLiteralModeHint(mode ?? null);
    }, []);
    useEffect(() => {
        if (!isFieldReferenceValue(value)) {
            setLastLiteralValue(value);
        }
    }, [value]);
    const operatorSupportsReferences = useMemo(() => {
        if (!field || !operator) {
            return false;
        }
        return isFieldReferenceOperatorSupported(field, operator);
    }, [field, operator]);
    const isReferenceFieldDisabled = useCallback((candidate) => {
        if (!field) {
            return false;
        }
        return !isFieldReferenceComparable(field, candidate);
    }, [field]);
    const toggleDisabled = !operatorSupportsReferences || !referenceFields.length;
    const handleToggle = () => {
        if (toggleDisabled) {
            return;
        }
        if (isFieldReferenceValue(value)) {
            onSelect(lastLiteralValue ?? null);
            return;
        }
        const comparableField = referenceFields.find((candidate) => !isReferenceFieldDisabled(candidate));
        const targetField = comparableField ?? referenceFields[0];
        if (!targetField) {
            return;
        }
        onSelect({
            type: 'field',
            fieldId: targetField.id,
            tableId: targetField.tableId ?? referenceTableId,
        });
    };
    const handleFieldSelect = (fieldId) => {
        if (!fieldId)
            return;
        onSelect({
            type: 'field',
            fieldId,
            tableId: referenceTableId,
        });
    };
    const fieldModeTooltip = t('filter.conditionalRollup.switchToValue');
    const literalModeTooltip = t('filter.conditionalRollup.switchToField');
    const tooltipLabel = isFieldReferenceValue(value) ? fieldModeTooltip : literalModeTooltip;
    const literalCandidate = isFieldReferenceValue(value) ? lastLiteralValue : value;
    useEffect(() => {
        if (isFieldReferenceValue(value)) {
            return;
        }
        if (literalCandidate && typeof literalCandidate === 'object' && 'mode' in literalCandidate) {
            setLiteralModeHint(literalCandidate.mode ?? null);
        }
    }, [literalCandidate, value]);
    const shouldHideToggle = useMemo(() => {
        if (isFieldReferenceValue(value)) {
            return false;
        }
        if (!field || field.cellValueType !== CellValueType.DateTime) {
            return false;
        }
        if (!literalModeHint) {
            return false;
        }
        return [exactDate.value, exactFormatDate.value].includes(literalModeHint);
    }, [field, literalModeHint, value]);
    const mergedLiteralComponent = useMemo(() => {
        const element = literalComponent;
        const existingModeChange = element.props.onModeChange;
        return cloneElement(element, {
            className: cn(element.props.className, '!h-9 min-w-[8rem] w-full', shouldHideToggle ? null : 'rounded-r-none border-r-0'),
            onModeChange: (mode) => {
                handleLiteralModeChange(mode);
                existingModeChange?.(mode);
            },
        });
    }, [handleLiteralModeChange, literalComponent, shouldHideToggle]);
    if (shouldHideToggle) {
        return mergedLiteralComponent;
    }
    return (_jsxs("div", { className: "flex items-stretch", children: [isFieldReferenceValue(value) ? (_jsx(FieldSelector, { fields: referenceFields, value: value.fieldId, onSelect: handleFieldSelect, modal: modal, className: "!h-9 w-40 rounded-r-none border-r-0", showTableName: Boolean(referenceTableId), tableId: referenceTableId, isOptionDisabled: isReferenceFieldDisabled })) : (mergedLiteralComponent), _jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", size: "icon", className: "-ml-px size-9 shrink-0 rounded-l-none border-input", onClick: handleToggle, disabled: toggleDisabled, "aria-label": tooltipLabel, children: _jsx(Switch, { className: "size-4" }) }) }), !toggleDisabled ? (_jsx(TooltipContent, { children: _jsx("span", { children: tooltipLabel }) })) : null] }) })] }));
};
export function BaseFieldValue(props) {
    const { onSelect, components, field, operator, value, linkContext, modal, referenceSource } = props;
    const { t } = useTranslation();
    const showEmptyComponent = useMemo(() => {
        const showEmpty = EMPTY_OPERATORS.includes(operator);
        showEmpty && onSelect?.(null);
        return showEmpty;
    }, [operator, onSelect]);
    if (showEmptyComponent) {
        return null;
    }
    const InputComponent = (_jsx(FilterInput, { placeholder: t('filter.default.placeholder'), value: value, onChange: onSelect, className: "w-40" }));
    const getFormulaValueComponent = (cType) => {
        switch (cType) {
            case CellValueType.Boolean:
                return _jsx(FilterCheckbox, { value: value, onChange: onSelect, className: "w-10" });
            case CellValueType.DateTime:
                return (_jsx(FilterDatePicker, { field: field, value: value, onSelect: onSelect, operator: operator }));
            case CellValueType.Number:
                return (_jsx(NumberEditor, { value: value, saveOnChange: true, onChange: onSelect, className: "w-40 placeholder:text-xs", placeholder: t('filter.default.placeholder') }));
            case CellValueType.String:
                return InputComponent;
            default:
                assertNever(cType);
        }
    };
    const wrapWithReference = (component) => {
        if (!referenceSource?.fields?.length ||
            !field ||
            !operator ||
            !isFieldReferenceOperatorSupported(field, operator)) {
            return component;
        }
        return (_jsx(ConditionalRollupValue, { literalComponent: component, value: value, onSelect: onSelect, operator: operator, referenceSource: referenceSource, modal: modal, field: field }));
    };
    switch (field?.type) {
        case FieldType.Number:
            return wrapWithReference(_jsx(NumberEditor, { value: value, saveOnChange: true, onChange: onSelect, className: "w-40 placeholder:text-xs", placeholder: t('filter.default.placeholder') }));
        case FieldType.SingleSelect:
            return wrapWithReference(ARRAY_OPERATORS.includes(operator) ? (_jsx(FilterMultipleSelect, { field: field, modal: modal, value: value, onSelect: (newValue) => onSelect(newValue), className: "min-w-28 max-w-64", popoverClassName: "max-w-64 min-w-28" })) : (_jsx(FilterSingleSelect, { field: field, modal: modal, value: value, onSelect: onSelect, operator: operator, className: "min-w-28 max-w-64", popoverClassName: "max-w-64 min-w-28" })));
        case FieldType.MultipleSelect:
            return wrapWithReference(_jsx(FilterMultipleSelect, { field: field, modal: modal, value: value, onSelect: (newValue) => onSelect(newValue), className: "min-w-28 max-w-64", popoverClassName: "min-w-28 max-w-64" }));
        case FieldType.Date:
        case FieldType.CreatedTime:
        case FieldType.LastModifiedTime:
            return wrapWithReference(_jsx(FilterDatePicker, { field: field, value: value, onSelect: onSelect, operator: operator, modal: modal }));
        case FieldType.Checkbox:
            return wrapWithReference(_jsx(FilterCheckbox, { value: value, onChange: onSelect, className: "w-10" }));
        case FieldType.Link: {
            const linkProps = {
                field,
                onSelect: (value) => onSelect(value?.length ? value : null),
                value: value,
                operator: operator,
                context: linkContext,
            };
            if (components && components[FieldType.Link]) {
                const LinkComponents = components[FieldType.Link];
                return _jsx(LinkComponents, { ...linkProps });
            }
            return _jsx(FilterLink, { ...linkProps, modal: modal });
        }
        case FieldType.Attachment:
            return _jsx(FileTypeSelect, { value: value, onSelect: onSelect });
        case FieldType.Rating:
            return wrapWithReference(_jsx(RatingEditor, { value: value, options: field.options, onChange: onSelect, className: "h-8 rounded-md border border-input px-2 shadow-sm", iconClassName: "w-4 h-4 mr-1" }));
        case FieldType.User:
        case FieldType.CreatedBy:
        case FieldType.LastModifiedBy: {
            const props = {
                field,
                onSelect: (value) => onSelect(value?.length ? value : null),
                value: value,
                operator: operator,
            };
            if (components && components[FieldType.User]) {
                const UserComponents = components[FieldType.User];
                return wrapWithReference(_jsx(UserComponents, { ...props }));
            }
            return wrapWithReference(_jsx(FilterUserSelect, { ...props, modal: modal }));
        }
        case FieldType.Rollup:
        case FieldType.Formula:
            return wrapWithReference(getFormulaValueComponent(field.cellValueType));
        case FieldType.ConditionalRollup:
            return wrapWithReference(getFormulaValueComponent(field.cellValueType));
        default:
            return wrapWithReference(InputComponent);
    }
}
