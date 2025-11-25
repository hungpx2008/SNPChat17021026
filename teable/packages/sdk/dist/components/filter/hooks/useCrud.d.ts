export declare const useCrud: () => {
    createCondition: (path: import("..").IFilterPath, index: "group" | "item") => void;
    onDelete: (path: import("..").IFilterPath, index: number) => void;
    onChange: (path: import("..").IFilterPath, value: unknown) => void;
    getValue: () => import("..").IBaseFilterValue<import("..").IConditionItemProperty>;
};
