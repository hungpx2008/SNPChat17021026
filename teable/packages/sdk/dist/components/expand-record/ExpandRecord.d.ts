import type { IRecord } from '@teable/core';
import type { IButtonClickStatusHook } from '../../hooks';
import { ExpandRecordModel } from './type';
interface IExpandRecordProps {
    recordId: string;
    recordIds?: string[];
    commentId?: string;
    visible?: boolean;
    model?: ExpandRecordModel;
    serverData?: IRecord;
    recordHistoryVisible?: boolean;
    commentVisible?: boolean;
    onClose?: () => void;
    onPrev?: (recordId: string) => void;
    onNext?: (recordId: string) => void;
    onCopyUrl?: () => void;
    onRecordHistoryToggle?: () => void;
    onCommentToggle?: () => void;
    onDelete?: () => Promise<void>;
    onDuplicate?: () => Promise<void>;
    buttonClickStatusHook?: IButtonClickStatusHook;
}
export declare const ExpandRecord: (props: IExpandRecordProps) => import("react/jsx-runtime").JSX.Element;
export {};
