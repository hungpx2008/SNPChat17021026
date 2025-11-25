import { type FC, type PropsWithChildren } from 'react';
import { ExpandRecordModel } from './type';
export declare const ExpandRecordWrap: FC<PropsWithChildren<{
    model?: ExpandRecordModel;
    modal?: boolean;
    visible?: boolean;
    onClose?: () => void;
    className?: string;
}>>;
