import type { SortFunc } from '@teable/core';
interface IOrderProps {
    value: SortFunc;
    fieldId: string;
    onSelect: (value: SortFunc) => void;
    triggerClassName?: string;
}
declare function OrderSelect(props: IOrderProps): import("react/jsx-runtime").JSX.Element;
export { OrderSelect };
