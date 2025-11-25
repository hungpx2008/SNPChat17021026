import type { InputProps } from '@teable/ui-lib';
interface SearchInputProps extends InputProps {
    search: string;
    onSearch: (value: string) => void;
}
export declare const SearchInput: ({ search, onSearch, ...props }: SearchInputProps) => import("react/jsx-runtime").JSX.Element;
export {};
