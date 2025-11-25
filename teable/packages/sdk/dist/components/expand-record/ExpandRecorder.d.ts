import type { IRecord } from '@teable/core';
import type { IButtonClickStatusHook } from '../../hooks';
import type { ExpandRecordModel } from './type';
interface IExpandRecorderProps {
    tableId: string;
    viewId?: string;
    recordId?: string;
    commentId?: string;
    recordIds?: string[];
    model?: ExpandRecordModel;
    serverData?: IRecord;
    onClose?: () => void;
    onUpdateRecordIdCallback?: (recordId: string) => void;
    buttonClickStatusHook?: IButtonClickStatusHook;
}
export declare const ExpandRecorder: (props: IExpandRecorderProps) => import("react/jsx-runtime").JSX.Element;
export {};
