import type { ReactNode } from 'react';
import type { SelectedMemberWithData } from './types';
interface IMemberContentProps {
    className?: string;
    departmentId?: string;
    defaultSelectedMembers?: SelectedMemberWithData[];
    disabledDepartment?: boolean;
    header?: ReactNode;
    onLoadData?: () => SelectedMemberWithData[];
    onCancel?: () => void;
    onConfirm?: (selectedMembers: SelectedMemberWithData[]) => void;
}
export interface IMemberContentRef {
    open: (selectedMembers?: SelectedMemberWithData[]) => void;
}
export declare const MemberContent: import("react").ForwardRefExoticComponent<IMemberContentProps & import("react").RefAttributes<IMemberContentRef>>;
export {};
