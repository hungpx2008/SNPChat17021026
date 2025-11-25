import { type ComboboxItemProps, ComboboxGroup, ComboboxGroupLabel, ComboboxPopover } from '@ariakit/react';
import type { TElement } from '@udecode/plate';
import * as React from 'react';
type FilterFn = (item: {
    value: string;
    group?: string;
    keywords?: string[];
    label?: string;
}, search: string) => boolean;
export declare const defaultFilter: FilterFn;
interface InlineComboboxProps {
    children: React.ReactNode;
    element: TElement;
    trigger: string;
    filter?: FilterFn | false;
    hideWhenNoValue?: boolean;
    showTrigger?: boolean;
    value?: string;
    setValue?: (value: string) => void;
}
declare const InlineCombobox: ({ children, element, filter, hideWhenNoValue, setValue: setValueProp, showTrigger, trigger, value: valueProp, }: InlineComboboxProps) => import("react/jsx-runtime").JSX.Element;
declare const InlineComboboxInput: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLInputElement> & React.RefAttributes<HTMLInputElement>>;
declare const InlineComboboxContent: typeof ComboboxPopover;
export type InlineComboboxItemProps = {
    focusEditor?: boolean;
    group?: string;
    keywords?: string[];
    label?: string;
} & ComboboxItemProps & Required<Pick<ComboboxItemProps, 'value'>>;
declare const InlineComboboxItem: ({ className, focusEditor, group, keywords, label, onClick, ...props }: InlineComboboxItemProps) => import("react/jsx-runtime").JSX.Element | null;
declare const InlineComboboxEmpty: ({ children, className }: React.HTMLAttributes<HTMLDivElement>) => import("react/jsx-runtime").JSX.Element | null;
declare const InlineComboboxRow: (props: import("@ariakit/react").ComboboxRowProps<"div">) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
declare function InlineComboboxGroup({ className, ...props }: React.ComponentProps<typeof ComboboxGroup>): import("react/jsx-runtime").JSX.Element;
declare function InlineComboboxGroupLabel({ className, ...props }: React.ComponentProps<typeof ComboboxGroupLabel>): import("react/jsx-runtime").JSX.Element;
export { InlineCombobox, InlineComboboxContent, InlineComboboxEmpty, InlineComboboxGroup, InlineComboboxGroupLabel, InlineComboboxInput, InlineComboboxItem, InlineComboboxRow, };
