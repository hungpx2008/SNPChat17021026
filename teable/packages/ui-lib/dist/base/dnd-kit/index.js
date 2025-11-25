import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { DndContext, useSensors, useSensor, TouchSensor, MouseSensor, DragOverlay, useDndContext, } from '@dnd-kit/core';
import { useSortable, SortableContext } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo } from 'react';
import { createPortal } from 'react-dom';
const DndKitContext = (props) => {
    const sensors = useSensors(useSensor(TouchSensor, {
        activationConstraint: {
            delay: 250,
            tolerance: 5,
        },
    }), useSensor(MouseSensor, {
        activationConstraint: {
            distance: 8,
        },
    }));
    return (_jsx(DndContext, { sensors: sensors, ...props, children: props.children }));
};
const Droppable = (props) => {
    const context = useDndContext();
    const { overlayRender, ...rest } = props;
    const children = props.children;
    const { active } = context;
    const customerOverLay = useMemo(() => {
        if (Array.isArray(children)) {
            return children.find((item) => !Array.isArray(item) && !item?.key) ?? null;
        }
        return null;
    }, [children]);
    const dragOverRender = useMemo(() => {
        if (!Array.isArray(children)) {
            return null;
        }
        if (active?.id) {
            // customer dragoverlay
            const listChildren = customerOverLay ? children[0] : children;
            const draggingOverLayElement = overlayRender
                ? overlayRender(active)
                : listChildren.find(({ props: { id } }) => id === active.id);
            const defaultDragOverLay = (_jsx("div", { style: {
                    cursor: 'grabbing',
                }, className: "rounded-sm p-0 m-0", children: _jsx("div", { className: "pointer-events-none", children: draggingOverLayElement }) }));
            return customerOverLay ? null : defaultDragOverLay;
        }
        return null;
    }, [active, children, customerOverLay, overlayRender]);
    return (_jsxs(SortableContext, { ...rest, children: [children, !customerOverLay && createPortal(_jsx(DragOverlay, { children: dragOverRender }), document.body)] }));
};
const Draggable = (props) => {
    const { id, disabled, children, style: injectStyle } = props;
    const sortProps = useSortable({
        id,
        disabled,
    });
    const { transform, transition } = sortProps;
    const customTransform = transform ? { ...transform, scaleX: 1, scaleY: 1 } : null;
    const style = {
        transition,
        transform: CSS.Transform.toString(customTransform),
        ...injectStyle,
    };
    const provided = {
        ...sortProps,
        style,
    };
    return _jsx(_Fragment, { children: children(provided) });
};
export { DndKitContext, Droppable, Draggable };
export * from '@dnd-kit/core';
export * from '@dnd-kit/sortable';
export * from '@dnd-kit/utilities';
