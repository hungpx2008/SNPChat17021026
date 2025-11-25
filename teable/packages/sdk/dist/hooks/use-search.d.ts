export declare function useSearch(): {
    setFieldId: (...args: any[]) => void;
    setValue: (...args: any[]) => void;
    reset: (...args: any[]) => void;
    setHideNotMatchRow: (...args: any[]) => void;
    fieldId?: string | undefined;
    value?: string | undefined;
    searchQuery?: [string] | [string, string] | [string, string, boolean] | undefined;
    hideNotMatchRow?: boolean | undefined;
};
