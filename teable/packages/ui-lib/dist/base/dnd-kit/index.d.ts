import type { Active } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { useSortable, type SortableContextProps } from '@dnd-kit/sortable';
import React from 'react';
type IProvidedProps = ReturnType<typeof useSortable> & {
    style: React.CSSProperties;
};
interface IDraggableContainerProps {
    id: string;
    style?: React.CSSProperties;
    disabled?: boolean;
    children: (provided: IProvidedProps) => React.ReactElement;
}
declare const DndKitContext: (props: React.ComponentProps<typeof DndContext>) => import("react/jsx-runtime").JSX.Element;
declare const Droppable: (props: SortableContextProps & {
    overlayRender?: ((active: Active | null) => JSX.Element) | undefined;
}) => import("react/jsx-runtime").JSX.Element;
declare const Draggable: (props: IDraggableContainerProps) => import("react/jsx-runtime").JSX.Element;
export { DndKitContext, Droppable, Draggable };
export * from '@dnd-kit/core';
export * from '@dnd-kit/sortable';
export * from '@dnd-kit/utilities';
export type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
