import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, cn, } from '@teable/ui-lib';
import { useMemo } from 'react';
import { useTranslation } from '../../context/app/i18n';
import { useFields, useFieldStaticGetter } from '../../hooks';
export function FieldCommand(props) {
    const { placeholder, emptyHolder, onSelect, selectedIds, fields: propsFields, groupHeading, isDisabled, } = props;
    const { t } = useTranslation();
    const defaultFields = useFields({ withHidden: true, withDenied: true });
    const fields = propsFields ?? defaultFields;
    const fieldStaticGetter = useFieldStaticGetter();
    const mergeFields = useMemo(() => {
        return fields.filter((field) => (selectedIds?.length ? !selectedIds.includes(field.id) : true));
    }, [fields, selectedIds]);
    return (_jsxs(Command, { className: "max-w-md rounded-lg p-0 shadow-md", children: [_jsx(CommandInput, { placeholder: placeholder || t('common.search.placeholder'), className: "text-xs", containerClassName: "border-none" }), _jsxs(CommandList, { children: [_jsx(CommandEmpty, { children: emptyHolder || t('common.search.empty') }), _jsx(CommandGroup, { heading: groupHeading, children: mergeFields?.map((field) => {
                            const { Icon } = fieldStaticGetter(field.type, {
                                isLookup: field.isLookup,
                                isConditionalLookup: field.isConditionalLookup,
                                hasAiConfig: Boolean(field.aiConfig),
                                deniedReadRecord: !field.canReadFieldRecord,
                            });
                            const disabled = isDisabled?.(field) ?? false;
                            return (_jsxs(CommandItem, { disabled: disabled, onSelect: () => {
                                    if (disabled) {
                                        return;
                                    }
                                    onSelect?.(field.id);
                                }, className: cn('flex', disabled && 'pointer-events-none opacity-40'), children: [_jsx(Icon, { className: "size-4 shrink-0" }), _jsx("span", { className: "truncate pl-3", children: field.name })] }, field.id));
                        }) })] })] }));
}
