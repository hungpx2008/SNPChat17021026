interface ISortFieldSelectProps {
    selectedFieldIds?: string[];
    addBtnText?: string;
    onSelect: (colum: string) => void;
}
declare function SortFieldAddButton(props: ISortFieldSelectProps): import("react/jsx-runtime").JSX.Element;
export { SortFieldAddButton };
