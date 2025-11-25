import type { IFieldInstance, Record as IRecord } from '../../../model';
interface IGridFilePreviewerProps {
    activeId: string;
    record: IRecord;
    field: IFieldInstance;
    i18nMap?: Record<string, string>;
}
export declare const GridFilePreviewer: (props: IGridFilePreviewerProps) => import("react/jsx-runtime").JSX.Element;
export declare const closePreviewModal: () => void;
export declare const expandPreviewModal: (props: IGridFilePreviewerProps) => {
    update: (props: IGridFilePreviewerProps) => {
        update: any;
    };
};
export {};
