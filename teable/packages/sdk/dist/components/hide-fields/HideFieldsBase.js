import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { DraggableHandle } from '@teable/icons';
import { Switch, Label, Button, Popover, PopoverTrigger, PopoverContent, Command, CommandEmpty, CommandInput, CommandItem, CommandList, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, DndKitContext, Draggable, Droppable, } from '@teable/ui-lib';
import { map } from 'lodash';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from '../../context/app/i18n';
import { useFieldStaticGetter } from '../../hooks';
import { ReadOnlyTip } from '../ReadOnlyTip';
export const HideFieldsBase = (props) => {
    const { fields, hidden, footer, children, onChange, onOrderChange } = props;
    const { t } = useTranslation();
    const fieldStaticGetter = useFieldStaticGetter();
    const [innerFields, setInnerFields] = useState([...fields]);
    const [dragHandleVisible, setDragHandleVisible] = useState(true);
    const dragEnabled = Boolean(onOrderChange) && dragHandleVisible;
    useEffect(() => {
        setInnerFields([...fields]);
    }, [fields]);
    const statusMap = useMemo(() => {
        return fields.reduce((acc, field) => {
            acc[field.id] = !hidden.includes(field.id);
            return acc;
        }, {});
    }, [fields, hidden]);
    const switchChange = (id, checked) => {
        if (checked) {
            onChange(hidden.filter((fieldId) => fieldId !== id));
            return;
        }
        onChange([...hidden, id]);
    };
    const showAll = () => {
        onChange([]);
    };
    const hideAll = () => {
        const hiddenFields = fields.filter((field) => !field.isPrimary);
        onChange(map(hiddenFields, 'id'));
    };
    const dragEndHandler = (event) => {
        const { over, active } = event;
        const to = over?.data?.current?.sortable?.index;
        const from = active?.data?.current?.sortable?.index;
        if (!over || to === from) {
            return;
        }
        const list = [...fields];
        const [field] = list.splice(from, 1);
        list.splice(to, 0, field);
        setInnerFields(list);
        onOrderChange?.(field.id, from, to);
    };
    const commandFilter = useCallback((fieldId, searchValue) => {
        const currentField = fields.find(({ id }) => fieldId.toLocaleLowerCase() === id.toLocaleLowerCase());
        const name = currentField?.name?.toLocaleLowerCase() || t('common.untitled');
        const containWord = name.indexOf(searchValue.toLowerCase()) > -1;
        return Number(containWord);
    }, [fields, t]);
    const searchHandle = (value) => {
        setDragHandleVisible(!value);
    };
    const content = () => (_jsxs("div", { className: "rounded-lg p-1", children: [_jsxs(Command, { filter: commandFilter, children: [_jsx(CommandInput, { placeholder: t('common.search.placeholder'), className: "h-8 text-xs", onValueChange: (value) => searchHandle(value) }), _jsxs(CommandList, { className: "my-2 max-h-64", children: [_jsx(CommandEmpty, { children: t('common.search.empty') }), _jsx(DndKitContext, { onDragEnd: dragEndHandler, children: _jsx(Droppable, { items: innerFields.map(({ id }) => ({ id })), children: innerFields.map((field) => {
                                        const { id, name, type, isLookup, isPrimary, aiConfig, canReadFieldRecord } = field;
                                        const { Icon } = fieldStaticGetter(type, {
                                            isLookup,
                                            isConditionalLookup: field.isConditionalLookup,
                                            hasAiConfig: Boolean(aiConfig),
                                            deniedReadRecord: !canReadFieldRecord,
                                        });
                                        return (_jsx(Draggable, { id: id, disabled: !dragEnabled, children: ({ setNodeRef, listeners, attributes, style, isDragging }) => (_jsx(_Fragment, { children: _jsx(CommandItem, { className: "flex flex-1 p-0", value: id, ref: setNodeRef, style: {
                                                        ...style,
                                                        opacity: isDragging ? '0.6' : '1',
                                                    }, children: _jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsxs("div", { className: "flex flex-1 items-center truncate p-0", children: [_jsxs(Label, { htmlFor: id, className: "flex flex-1 cursor-pointer items-center truncate p-2", children: [_jsx(Switch, { id: id, className: "scale-75", checked: statusMap[id], onCheckedChange: (checked) => {
                                                                                            switchChange(id, checked);
                                                                                        }, disabled: isPrimary }), _jsx(Icon, { className: "ml-2 size-4 shrink-0" }), _jsx("span", { className: "h-full flex-1 cursor-pointer truncate pl-1 text-sm", children: name })] }), dragEnabled && (_jsx("div", { ...attributes, ...listeners, className: "pr-1", children: _jsx(DraggableHandle, {}) }))] }) }), isPrimary ? (_jsx(TooltipContent, { children: _jsx("pre", { children: t('hidden.primaryKey') }) })) : null] }) }) }, id) })) }, id));
                                    }) }) })] })] }), dragHandleVisible && (_jsxs("div", { className: "flex justify-between p-2", children: [_jsx(Button, { variant: "secondary", size: "xs", className: "w-32 text-muted-foreground hover:text-secondary-foreground", onClick: showAll, children: t('hidden.showAll') }), _jsx(Button, { variant: "secondary", size: "xs", className: "w-32 text-muted-foreground hover:text-secondary-foreground", onClick: hideAll, children: t('hidden.hideAll') })] }))] }));
    return (_jsxs(Popover, { modal: true, children: [_jsx(PopoverTrigger, { asChild: true, children: children }), _jsxs(PopoverContent, { side: "bottom", align: "start", className: "relative p-0", children: [_jsx(ReadOnlyTip, {}), content(), footer] })] }));
};
