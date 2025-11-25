interface IExpandRecordHeader {
    tableId: string;
    recordId: string;
    title?: string;
    recordHistoryVisible?: boolean;
    commentVisible?: boolean;
    disabledPrev?: boolean;
    disabledNext?: boolean;
    onClose?: () => void;
    onPrev?: () => void;
    onNext?: () => void;
    onCopyUrl?: () => void;
    onRecordHistoryToggle?: () => void;
    onCommentToggle?: () => void;
    onDelete?: () => Promise<void>;
    onDuplicate?: () => Promise<void>;
}
export declare const ExpandRecordHeader: (props: IExpandRecordHeader) => import("react/jsx-runtime").JSX.Element;
export {};
