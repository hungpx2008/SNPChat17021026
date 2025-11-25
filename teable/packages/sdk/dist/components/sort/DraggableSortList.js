import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { DraggableHandle, Trash2 } from '@teable/icons';
import { Button, cn, DndKitContext, Droppable, Draggable } from '@teable/ui-lib';
import { useIsHydrated } from '../../hooks';
import { SortItem } from './SortItem';
function DraggableItem(props) {
    const { value, index, onSelect, deleteHandler, selectedFields, displayDragHandler, attributes, listeners, } = props;
    return (_jsxs(_Fragment, { children: [_jsx(SortItem, { value: value, index: index, onSelect: onSelect, selectedFields: selectedFields }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => deleteHandler(index), children: _jsx(Trash2, { className: "size-4" }) }), _jsx("div", { className: cn('pl-2', displayDragHandler ? null : 'hidden'), ...attributes, ...listeners, children: _jsx(DraggableHandle, {}) })] }));
}
function DraggableSortList(props) {
    const { sorts, onChange, selectedFields } = props;
    const isHydrated = useIsHydrated();
    const deleteHandler = (index) => {
        const newSorts = [...sorts];
        newSorts.splice(index, 1);
        onChange(newSorts);
    };
    const handleDragEnd = (event) => {
        const newSorts = [...sorts];
        const { over, active } = event;
        const to = over?.data?.current?.sortable?.index;
        const from = active?.data?.current?.sortable?.index;
        if (!over) {
            return;
        }
        newSorts.splice(to, 0, ...newSorts.splice(from, 1));
        onChange(newSorts);
    };
    const selectHandler = (index, item) => {
        const newSorts = [...sorts];
        newSorts.splice(index, 1, {
            ...item,
        });
        onChange(newSorts);
    };
    return (_jsx(DndKitContext, { onDragEnd: handleDragEnd, children: isHydrated && (_jsx(Droppable, { items: sorts.map(({ fieldId }) => ({ id: fieldId })), children: sorts.map((sort, index) => (_jsx(Draggable, { id: sort.fieldId, children: ({ setNodeRef, style, isDragging, listeners, attributes }) => (_jsx("div", { ref: setNodeRef, style: style, className: cn('flex items-center bg-card my-2 flex-nowrap', isDragging ? 'opacity-50' : null), children: _jsx(DraggableItem, { value: sort, index: index, onSelect: selectHandler, deleteHandler: deleteHandler, selectedFields: selectedFields, displayDragHandler: sorts.length > 1, attributes: attributes, listeners: listeners }, sort.fieldId) })) }, sort.fieldId))) })) }));
}
export { DraggableSortList };
