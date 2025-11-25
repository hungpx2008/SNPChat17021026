import type { IFieldVo } from '@teable/core';
import type { ReactNode } from 'react';
import type { IFieldInstance } from '../../model';
interface IFieldCreateOrSelectModalProps {
    title: ReactNode;
    content?: ReactNode;
    description?: ReactNode;
    selectedFieldId?: string;
    isCreatable?: boolean;
    getCreateBtnText: (fieldName: string) => ReactNode;
    children: (isActive: boolean) => React.ReactNode;
    onConfirm?: (field: IFieldVo | IFieldInstance) => void;
}
export interface IFieldCreateOrSelectModalRef {
    onOpen: () => void;
    onClose: () => void;
}
export declare const FieldCreateOrSelectModal: import("react").ForwardRefExoticComponent<IFieldCreateOrSelectModalProps & import("react").RefAttributes<IFieldCreateOrSelectModalRef>>;
export {};
