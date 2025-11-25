/// <reference types="react" />
interface ICreateRecordModalProps {
    children?: React.ReactNode;
    callback?: (recordId: string) => void;
}
export declare const CreateRecordModal: (props: ICreateRecordModalProps) => import("react/jsx-runtime").JSX.Element;
export {};
