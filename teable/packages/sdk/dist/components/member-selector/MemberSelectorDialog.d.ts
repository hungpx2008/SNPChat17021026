import * as React from 'react';
import type { SelectedMemberWithData } from './types';
interface IMemberSelectorDialogProps {
    defaultSelectedMembers?: SelectedMemberWithData[];
    departmentId?: string;
    children?: React.ReactNode;
    disabledDepartment?: boolean;
    header?: React.ReactNode;
    onLoadData?: () => SelectedMemberWithData[];
    onConfirm?: (members: SelectedMemberWithData[]) => void;
    onCancel?: () => void;
}
export interface IMemberSelectorDialogRef {
    open: (selectedMembers?: SelectedMemberWithData[]) => void;
    close: () => void;
}
export declare const MemberSelectorDialog: React.ForwardRefExoticComponent<IMemberSelectorDialogProps & React.RefAttributes<IMemberSelectorDialogRef>>;
export default MemberSelectorDialog;
