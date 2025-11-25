import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@teable/ui-lib';
import { useFieldStaticGetter } from '../../hooks';
import { CellEditorWrap } from './CellEditorWrap';
export const RecordEditorItem = (props) => {
    const { field, record, vertical, onChange, readonly, buttonClickStatusHook } = props;
    const { type, isLookup } = field;
    const fieldStaticGetter = useFieldStaticGetter();
    const { Icon } = fieldStaticGetter(type, {
        isLookup,
        isConditionalLookup: field.isConditionalLookup,
        hasAiConfig: Boolean(field.aiConfig),
    });
    const cellValue = record?.getCellValue(field.id);
    const onChangeInner = (value) => {
        if (cellValue === value)
            return;
        onChange?.(value, field.id);
    };
    return (_jsxs("div", { className: vertical ? 'flex space-x-2' : 'space-y-2', children: [_jsxs("div", { className: cn('w-36 flex items-top space-x-1', vertical ? 'pt-1' : 'w-full'), children: [_jsx("div", { className: "flex size-5 items-center", children: _jsx(Icon, { className: "size-4" }) }), _jsx("div", { className: cn('text-sm truncate', vertical && 'break-words whitespace-normal'), children: field.name }), field.notNull && (_jsx("span", { className: "text-red-500", "aria-label": "required", children: "*" }))] }), _jsx(CellEditorWrap, { wrapClassName: "min-w-0 flex-1 p-0.5", cellValue: cellValue, onChange: onChangeInner, field: field, recordId: record?.id, readonly: !record || readonly, buttonClickStatusHook: buttonClickStatusHook })] }));
};
